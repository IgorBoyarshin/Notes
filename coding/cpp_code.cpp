// ----------------------------------------------------------------------------
// ---------------- String split
// ----------------------------------------------------------------------------
#include <string>
#include <vector>
#include <sstream>

template<typename Out>
void split(const std::string &s, char delim, Out result) {
    std::stringstream ss(s);
    std::string item;
    while (std::getline(ss, item, delim)) {
        *(result++) = item;
    }
}

std::vector<std::string> split(const std::string &s, char delim) {
    std::vector<std::string> elems;
    split(s, delim, std::back_inserter(elems));
    return elems;
}
// ----------------------------------------------------------------------------
// --------------- Create subvector
// ----------------------------------------------------------------------------
#include <vector>

std::vector<int> vec;
std::vector<int>::const_iterator from = vec.begin() + 10;
std::vector<int>::const_iterator to = vec.begin() + 15;
std::vector<int> subvector(from, to);
// ----------------------------------------------------------------------------
// ---------------- Quick sort
// ----------------------------------------------------------------------------
void quickSort(int array[], int left, int right) {
    int i = left;
    int j = right;
    const int pivot = array[(left + right) / 2];

    while (i <= j) {
        while (array[i] < pivot) {
            i++;
        }
        while (pivot < array[j]) {
            j--;
        }

        if (i <= j) {
            const int tmp = array[i];
            array[i] = array[j];
            array[j] = tmp;
            i++;
            j--;
        }
    }

    if (left < j) {
        quickSort(array, left, j);
    }
    if (i < right) {
        quickSort(array, i, right);
    }
}
// ----------------------------------------------------------------------------
// --------------- Fast IO
// ----------------------------------------------------------------------------
#include <iostream>

static auto x = [](){
    // turn off sync
    std::ios::sync_with_stdio(false);
    // untie in/out streams
    std::cin.tie(NULL);

    return 0;
} ();
// ----------------------------------------------------------------------------
// --------------- Output stream
// ----------------------------------------------------------------------------
std::ostream& operator<<(std::ostream& stream, const std::string& number) {
    stream << number;
    return stream;
}
