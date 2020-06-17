#include <time.h>

long int start_time;
long int time_difference;
struct timespec gettime_now;
clock_gettime(CLOCK_REALTIME, &gettime_now);
start_time = gettime_now.tv_nsec;

// Do stuff

clock_gettime(CLOCK_REALTIME, &gettime_now);
time_difference = (gettime_now.tv_nsec - start_time);
printf("===== Elapsed=%ld ns\n", time_difference);
