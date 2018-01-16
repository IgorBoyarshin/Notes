Monad

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
