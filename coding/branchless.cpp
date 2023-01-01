// b[i] is poorly predictable

// With a branch:
for (i) {
    if (b[i]) {
        a1 += p1[i] - p2[i];
    } else {
        a2 += p1[i] * p2[i];
    }
}

// Without branches:
for (i) {
    int r1[2] = { 0, p1[i] - p2[i] };
    int r2[2] = {  p1[i] - p2[i], 0};
    a1 += r1[bool(b[i])];
    a2 += r2[bool(b[i])];
}
// ============================================================================
// ============================================================================
// ============================================================================
bool x, y; // both poorly predictable, however their sum is easily predictable

if (x || y) {}

if (x | y) {}
if (bool(x) + bool(y)) {} // if x,y were not bool already
