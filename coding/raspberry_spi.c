#include <pic_types.h>
#include <pic_common.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdbool.h>
#include <stdio.h>
#include <time.h>
#include <unistd.h>
#include <strings.h> // for bzero 
#include <sys/wait.h>
#include <sys/types.h>
#include <fcntl.h>
#include <sys/ioctl.h>
#include <linux/types.h>
#include <linux/spi/spidev.h>


typedef struct spi_inteface {
    uint8_t port;
    uint8_t bits;
    uint8_t mode;
    uint32_t speed;
    uint16_t delay;
    int fd;
    const char* device; // Unix device name /dev/spidev0.0

} spi_interface_t;


/**
 * Function to initialize the SPI port
 *
 * @param pic_handle
 * @param port   Port number
 * @param speed  Clock speed in Hz
 */
void spi_open(pic_handle_t* pic_handle, uint8_t port, uint32_t speed);


/**
 * Close the current SPI interface port
 *
 * @param pic_handle
 */
void spi_close(pic_handle_t* pic_handle);


/**
 * Transfer data from and to the device
 *
 * @param pic_handle
 * @param tx_data    Transmit data buffer
 * @param rx_data    Receiver data buffer
 * @param cnt        Number of bytes to transmit and receive
 */
void spi_transfer(pic_handle_t* pic_handle, const uint8_t* tx_data,  uint8_t* rx_data, uint8_t cnt);


/* static const char* device0 = "/dev/spidev1.0"; */
/* static const char* device1 = "/dev/spidev1.1"; */
static const char* devices[]= {
     "/dev/spidev0.0",
     "/dev/spidev0.1"
};

void spi_open(pic_handle_t* handle, uint8_t port, uint32_t speed) {
    spi_interface_t* spi = NULL;
    uint8_t mode = 0;
    int ret = 0;
    if ( pic_ok(handle) ) {
        if (port < 2) {
            if (handle->interface_handle == NULL) {
                spi=malloc(sizeof(spi_interface_t));
                handle->interface_handle = spi;
                spi->device=devices[port];
                spi->port=port;
                spi->speed=speed;
                spi->bits=8;
                spi->delay=0;
                // Try to open the SPI device
                spi->fd = open(spi->device, O_RDWR);
                if ( spi->fd < 0 ) {
                    pic_set(handle, PIC_ERR_OPEN);
		    printf("fail device open\n ");
                    goto fail;
                }
                // Set SPI mode
                // Following SPI mode options
                // mode |= SPI_LOOP;
                // mode |= SPI_CPHA;
                // mode |= SPI_CPOL;
                // mode |= SPI_LSB_FIRST;
                // mode |= SPI_CS_HIGH;
                spi->mode=mode;
		
                ret = ioctl(spi->fd, SPI_IOC_WR_MODE, &mode);
                if ( ret < 0 ) {
                    pic_set(handle, PIC_ERR_INTERFACE_MODE);
		    printf("fail SPI_IOC_WR_MODE\n ");
                    goto fail;
                }
                ret = ioctl(spi->fd, SPI_IOC_RD_MODE, &mode);
                if ( ret < 0 ) {
                    pic_set(handle, PIC_ERR_INTERFACE_MODE);
		    printf("fail SPI_IOC_RD_MODE\n");
                    goto fail;
                }
                // Bits per word
                ret = ioctl(spi->fd, SPI_IOC_WR_BITS_PER_WORD, &(spi->bits));
                if ( ret < 0 ) {
                    pic_set(handle, PIC_ERR_INTERFACE_BITSIZE);
		    printf("fail SPI_IOC_WR_BITS_PER_WORD\n");
                    goto fail;
                }
                ret = ioctl(spi->fd, SPI_IOC_RD_BITS_PER_WORD, &(spi->bits));
                if ( ret < 0 ) {
                    pic_set(handle, PIC_ERR_INTERFACE_BITSIZE);
		    printf("fail SPI_IOC_RD_BITS_PER_WORD\n");
                    goto fail;
                }

                // Clock speed in Hz
                ret = ioctl(spi->fd, SPI_IOC_WR_MAX_SPEED_HZ, &(spi->speed));
                if ( ret < 0 ) {
                    pic_set(handle, PIC_ERR_INTERFACE_SPEED);
		    printf("fail SPI_IOC_WR_MAX_SPEED_HZ\n");
                    goto fail;
                }
                ret = ioctl(spi->fd, SPI_IOC_RD_MAX_SPEED_HZ, &(spi->speed));
                if ( ret < 0 ) {
                    pic_set(handle, PIC_ERR_INTERFACE_SPEED);
		    printf("fail SPI_IOC_RD_MAX_SPEED_HZ\n");
                    goto fail;
                }
		
            }
            else {
                pic_set(handle, PIC_ERR_REOPEN);
            }
        }
        else {
            pic_set(handle, PIC_ERR_INTERFACE_INVALID_PORT);
        }
    }
    return;
  fail:
    if (spi != NULL) {
        close(spi->fd);
        free(spi);
        handle->interface_handle = NULL;
        pic_set(handle, PIC_ERR_INTERFACE);
    }
}

void spi_close(pic_handle_t* handle) {
    spi_interface_t* spi = handle->interface_handle;
    if ( spi != NULL ) {
        close(spi->fd);
        free(spi);
        handle->interface_handle = NULL;
    }
}

void spi_transfer(pic_handle_t* handle, const uint8_t* tx_data,  uint8_t* rx_data, uint8_t cnt) {
    spi_interface_t* spi = handle->interface_handle;
    int ret;
    if ( pic_ok(handle) ) {
        if ( spi == NULL ) {
            pic_set(handle, PIC_ERR_INTERFACE_NOTVALID);
            goto fail;
        }
        struct spi_ioc_transfer tr = {
            .tx_buf = (unsigned long)tx_data,
            .rx_buf = (unsigned long)rx_data,
            .len = cnt,
            .delay_usecs = spi->delay,
            .speed_hz = spi->speed,
            .bits_per_word = spi->bits,
	};
        ret = ioctl(spi->fd, SPI_IOC_MESSAGE(1), &tr);
        if ( ret < 0 ) {
            pic_set(handle, PIC_ERR_INTERFACE_MESSAGE);
	    printf("fail SPI_IOC_MESSAGE\n");
            goto fail;
        }
    }
    return;
  fail:
    return;
}

