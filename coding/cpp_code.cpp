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
std::ostream& operator<<(std::ostream& stream, const std::string& str) {
    stream << str;
    return stream;
}
// ----------------------------------------------------------------------------
// --------------- Time measurement
// ----------------------------------------------------------------------------
#include <chrono>
// std::chrono::nanoseconds
//            ::microseconds
//            ::milliseconds
//            ::seconds...

const auto start = std::chrono::steady_clock::now();
const auto someJob = [](){return 0;}();
const auto elapsedMillis = std::chrono::duration_cast<std::chrono::milliseconds>(
                        std::chrono::steady_clock::now() - start
                    ).count();
// ----------------------------------------------------------------------------
// --------------- Proper random
// ----------------------------------------------------------------------------
#include <random>

// [signed, unsigned]: short, int, long, long long
// [low, high]
template<typename T = int>
T getRandomUniformInt(T low, T high) {
    static std::random_device rd;
    /* static std::seed_seq seed{1, 2, 3, 300}; */
    /* static std::mt19937 e2(seed); */
    static std::mt19937 e2(rd());
    std::uniform_int_distribution<T> dist(low, high);

    return dist(e2);
}

// float, double, long double
// [low, high)
template<typename T = float>
T getRandomUniformFloat(T low, T high) {
    static std::random_device rd;
    /* static std::seed_seq seed{1, 2, 3, 300}; */
    /* static std::mt19937 e2(seed); */
    static std::mt19937 e2(rd());
    std::uniform_real_distribution<T> dist(low, high);

    return dist(e2);
}
// ----------------------------------------------------------------------------
// --------------- Explicit specialization in non-namespace scope solution
// ----------------------------------------------------------------------------
template<typename T>
struct identity { typedef T type; };


template<typename T>
class CConstraint
{
    public:
        template <typename TL>
            void Verify(int position, int constraints[])
            {
                Verify(position, constraints, identity<TL>());
            }

    private:
        template<typename TL>
            void Verify(int, int[], identity<TL>)
            {
                // Unspecialized
            }

        void Verify(int, int[], identity<int>)
        {
            // Good
        }
};
// ----------------------------------------------------------------------------
// --------------- Suppress "unused parameter" warning
// ----------------------------------------------------------------------------
void func(__attribute__((unused)) int x) {}
// ----------------------------------------------------------------------------
// --------------- Memset
// ----------------------------------------------------------------------------
int buffer[5];
memset(buffer, 0, 5 * sizeof(int))
// ----------------------------------------------------------------------------
// --------------- Print bits representation of a number
// ----------------------------------------------------------------------------
#include <bitset>

int main() {
    std::cout << std::bitset<8>(15) << std::endl;
}
// ----------------------------------------------------------------------------
// --------------- Wait for all children that the process has to finish
// ----------------------------------------------------------------------------
while (waitpid(-1, NULL, 0)) if (errno == ECHILD) break;
// ----------------------------------------------------------------------------
// --------------- Enum
// ----------------------------------------------------------------------------
struct MouseButton {
    enum Value {
        Left, Middle, Right
    };
};

void handleMouseButton( MouseButton::Value b ) {
    switch ( b ) {
        case MouseButton::Left:   // ...
        case MouseButton::Middle: // ...
        case MouseButton::Right:  // ...
    }
}
// ----------------------------------------------------------------------------
// --------------- Print type of variable
// ----------------------------------------------------------------------------
// #include <cstddef>
// #include <stdexcept>
// #include <cstring>
// #include <ostream>
template <class T>
constexpr std::string_view type_name() {
    using namespace std;
#ifdef __clang__
    string_view p = __PRETTY_FUNCTION__;
    return string_view(p.data() + 34, p.size() - 34 - 1);
#elif defined(__GNUC__)
    string_view p = __PRETTY_FUNCTION__;
#  if __cplusplus < 201402
    return string_view(p.data() + 36, p.size() - 36 - 1);
#  else
    return string_view(p.data() + 49, p.find(';', 49) - 49);
#  endif
#elif defined(_MSC_VER)
    string_view p = __FUNCSIG__;
    return string_view(p.data() + 84, p.size() - 84 - 7);
#endif
}
