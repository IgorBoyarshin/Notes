-------------------------------------------------------------------------------
---------------- General
-------------------------------------------------------------------------------
Compile with Stack
:> stack exec -- ghc Main.hs -o Main

Run without compiling
:> stack exec -- runghc Main.hs


Compile for parallel
:> stack exec -- ghc -O2 -threaded --make parallel-test.hs

Run for parallel(4 threads)
:> ./Main +RTS +N4


Print the value of an expression without causing it to be evaluated
:> :sprint x

Evaluate its first argument(to weak head normal form(WHNF) === first-level constructor), return second argument
:> seq


Clear screen in Prelude
:> :! run the shell command
:> :! cls under windows
:> :! clear under linux and OS X
-------------------------------------------------------------------------------
---------------- Main file example
-------------------------------------------------------------------------------
-- import Data.List
-- import System.IO
-- import Control.Applicative
-- import Control.Monad
-- import Data.List
-- import Data.Char
-- import System.IO

-- import Control.Monad
-- import Control.Monad.ST
-- import Data.Array.ST
-- import Data.Array.Unboxed

-- ghci
-- :l main.hs
-- :r
-- :i info about Base class
--

main :: IO ()
main = return ()
-------------------------------------------------------------------------------
---------------- Parallel computations test
-------------------------------------------------------------------------------
import Control.Parallel
import Control.Monad
import Text.Printf

cutoff :: Int
cutoff = 35

fib' :: Int -> Integer
fib' 0 = 0
fib' 1 = 1
fib' n = fib' (n-1) + fib' (n-2)

fib :: Int -> Integer
fib n | n < cutoff = fib' n
      | otherwise  = r `par` (l `pseq` l + r)
 where
    l = fib (n-1)
    r = fib (n-2)

main :: IO ()
main = forM_ [0..45] $ \i ->
            printf "n=%d => %d\n" i (fib i)
-------------------------------------------------------------------------------
---------------- Get binary number representation
-------------------------------------------------------------------------------
import Text.Printf
let a = 5207 in putStrLn $ printf "%d = %b" a a
-------------------------------------------------------------------------------
---------------- Convert from binary to decimal
-------------------------------------------------------------------------------
import Data.Char (digitToInt)
import Data.List (foldl')

toDec :: String -> Int
toDec = foldl' (\acc x -> acc * 2 + digitToInt x) 0
-------------------------------------------------------------------------------
---------------- Disable warnings(errors)
-------------------------------------------------------------------------------
{-# OPTIONS_GHC -fno-warn-unused-binds #-}
Other flags:
https://downloads.haskell.org/~ghc/7.8.2/docs/html/users_guide/flag-reference.html
-------------------------------------------------------------------------------
---------------- Random stuff
-------------------------------------------------------------------------------
Kleisli operator:
(>=>) :: (a -> m b) -> (b -> m c) -> (a -> m c)
f >=> g = \a -> let mb = f a
                 in mb >>= g

Bind operator:
(>>=) :: m a -> (a -> m b) -> m b
ma >>= f = join (fmap f ma)

Join operator:
join :: m (m a) -> m a -- flattens


class Monad m where
    (>>=) :: m a -> (a -> m b) -> m b
    return :: a -> m a -- lifts

class Functor m => Monad m where
    join :: m (m a) -> m a
    return :: a -> m a


Maybe Monad:
1) One solution
    f :: a -> Maybe b
    Mothing >>= f = Nothing
    Just a >>= f = f a
2) Second solution
    join :: m (m a) -> m a
    join Just (Just a) = Just a
    join _ = Nothing


fmap :: Functor f => (a -> b) -> f a -> f b
-- Lifts a function


Lifting
Variable:
return :: a -> m a
Function:
fmap :: (a -> b) -> f a -> f b


(<-) operator unwraps the content. The embellishment(state) is carried through the do block, it does not disappear
-------------------------------------------------------------------------------
---------------- Random stuff 2
-------------------------------------------------------------------------------
type Writer a = (a, String)

(>=>) :: (a -> Writer b) -> (b -> Writer c) ->  (a -> Writer c)
m1 >=> m2 = \x ->
    let (y, s1) = m1 x
        (z, s2) = m2 y
    in (z, s1 ++ s2)

return :: a -> Writer a
return x = (x, "")




-- Empty main function
main :: IO ()
main = return ()



--------------------------------
Functor
    fmap :: Functor f      =>   (a -> b) -> f a -> f b

Applicative Functor
    (<*>) :: Applicative f => f (a -> b) -> f a -> f b
    (<$>) :: Functor f     =>   (a -> b) -> f a -> f b
        f <$> x = fmap f x

Monad
    (>>=) :: Monad m       => m a -> (a -> m b) -> m b
    (>>)  :: Monad m       => m a ->       m b  -> m b
        a >> f = a >>= \_ -> f
    (=<<) :: Monad m       => (a -> m b) -> m a -> m b


class Monad m where
    (>>=)  :: m a -> (a -> m b) -> m b
    return :: a -> m a
    (>>) :: m a -> m b -> m b
    a >> f = a >>= \_ -> f
    fail :: String -> m a
    fail = error

instance Monad [] where
    return x = [x]
    xs >>= f = concat (map f xs)

liftM :: (Monad m) => (a -> b) -> m a -> m b
liftM f m = m >>= \i -> return (f i)

liftA2 :: (Applicative f) => (a -> b -> c) -> f a -> f b -> f c
liftA2 f a b = f <$> a <*> b

lengthCompare :: String -> String -> Ordering
lengthCompare x y = (length x `compare` length y) `mappend`
                    (x `compare` y)

let tu x = (1,x) in
liftM tu [3,4]  ===  [3,4] >>= \x -> return (tu x)
  ===  liftA tu [3,4]  ===  tu <$> [3,4]  ===  [(1,3),(1,4)]

[(1,3),(1,4),(2,3),(2,4)]  ===  (,) <$> [1,2] <*> [3,4]  ===  liftA2 (,) [1,2] [3,4]
  ===  [1,2] >>= \x -> [3,4] >>= \y -> return (x,y)  ===  liftM2 (,) [1,2] [3,4]


ww = (*)
ee = Just (*)
a = Just 3
b = Just 4
same1 = fmap ww a <*> b
same2 = ee <*>  a <*> b
same3 = ww <$>  a <*> b
-- f <$> x = fmap f x

divs  n = filter (\(a,b) -> a*b == n) $ (,) <$> [1..n] <*> [1..n]
divs2 n = filter (\(a,b) -> a*b == n) $ do {x <- [1..n]; y <- [x..n]; return (x,y)}

sequenceA :: (Applicative f) => [f a] -> f [a]
sequenceA = foldr (liftA2 (:)) (pure [])
.. = and $ sequenceA [(>4), odd] 7


(,,) === \x y z -> (x,y,z)

-- Primes generator
primes = 2 : filter (null . tail . primeFactors) [3,5..]
primeFactors n = factor n primes
                    where factor n (p:ps)
                            | p*p > n        = [n]
                            | n `mod` p == 0 = p : factor (n `div` p) (p:ps)
                            | otherwise      =     factor n ps

-- foldl step zero (x:xs) = foldl step (step zero x) xs
-- foldl _    zero []     = zero
-- ((zero op a1) op a2) op a3

-- foldr step zero (x:xs) = step x (foldr step zero xs)
-- foldr _    zero []     = zero
-- a1 op (a2 op (a3 op zero))

quickSort :: (Ord a) => [a] -> [a]
quickSort [] = []
quickSort (x:xs) = quickSort (filter (<=x) xs) ++ [x] ++ (filter (>x) xs)

sm = [x^x | x <- [1..100], mod x 23 == 0] -- x 'mod' 23

encrypt :: String -> String
encrypt x = map succ x

decrypt :: String -> String
decrypt x = map pred x

main = do
    input <- getLine
    putStrLn $ encrypt input


-- mapM_ will work wth IO functions
-- mapM_ print ["a", "b"]

-- fmap unwraps, applies function, wraps
-- fmap (+1) (Just 2) === (Just 3)
-- fmap (++ " world") getLine
-- <$> - same as 'fmap'

-- LISTS
-- head tail last init
-- [1,2,3] !! 1 === 2
-- [1,2] ++ [3,4]
-- 0 : [1,2]
-- take 2 [1,2,3] === [1,2]
-- drop 2 [1,2,3] === [3]
-- [1..10], [1,3..11], [1..]

-- TUPLES
-- (22, "age")
-- fst, snd
-- lookup 'smth' --- returns the second argument for the entry in the list
-- zip [1,2], ['a', 'b'] --- combines lists into the a of tuples
-- trd (_,_,x) = x --- we define a func

-- someFunc 3 = 0
-- someFunc _ = -1
-- map (+1) [1..3] === [2,3,4]
mapp _ [] = []
mapp fu (x:xs) = fu x : mapp fu xs

-- GUARDS
-- last5 [] = []
-- last5 = xxs@(_:xs)
--    | length xxs <= 5 = xxs
--    | otherwise       = last5 xs

-- type User = (String, Int)
-- type Id = Int
-- newtype MyId = Id { getId :: Int } deriving (Show)
-- data User = Users
--             | User { userId :: Int
--                    userName :: String
--                  } deriving (Show)

-- read turns text into type

-- instance Eq MyData where
--      firstConstr == SecondConstr = True
--      _ == _ = False

-- Not the best way to use Maybe:
-- fromMaybe :: a -> Maybe a -> a
-- fromMaybe b Nothing = b
-- fromMaybe _ (Just a) = a

