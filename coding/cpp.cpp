//-----------------------------------------------------------------------------
//-------------- String split
//-----------------------------------------------------------------------------
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
//-----------------------------------------------------------------------------
//-------------- Create subvector
//-----------------------------------------------------------------------------
std::vector<T>::const_iterator from = vec.begin() + 10;
std::vector<T>::const_iterator to = vec.begin() + 15;
std::vector<T> subvector(from, to);
//-----------------------------------------------------------------------------
//-------------- lvalue, rvalue, move semantics
//-----------------------------------------------------------------------------
https://stackoverflow.com/questions/3106110/what-are-move-semantics


      int& r1 = 5; // Error
const int& r2 = 5; // OK


// Reference collapsing rule
 &  & ->  &
&&  & ->  &
 & && ->  &
&& && -> &&


// Perfect forwarding
template<typename T>
void relay(T&& arg) {
    foo ( std::forward<T> (arg));
}

// Implementation of std::forward()
template<typename T>
T&& forward(typename remove_reference<T>::type& arg) {
    return static_cast<T&&>(arg);
}


          | lvalue | const lvalue | rvalue | const rvalue
----------|--------|--------------|--------|-------------
      X&  | yes    |              |        |
const X&  | yes    | yes          | yes    | yes
      X&& |        |              | yes    |
----------|--------|--------------|--------|-------------
const X&& |        |              | yes    | yes

// In practice, you can forget about const X&&.
// Being restricted to read from rvalues is not very useful.
//-----------------------------------------------------------------------------
//-------------- Quick sort
//-----------------------------------------------------------------------------
void quickSort(int arr[], int left, int right) {
    int i = left, j = right;
    int tmp;
    int pivot = arr[(left + right) / 2];

    while (i <= j) {
        while (arr[i] < pivot) {
            i++;
        }
        while (arr[j] > pivot) {
            j--;
        }

        if (i <= j) {
            tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
            i++;
            j--;
        }
    };

    if (left < j) {
        quickSort(arr, left, j);
    }
    if (i < right) {
        quickSort(arr, i, right);
    }
}
