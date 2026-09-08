Treat the schema definition in application code as intent and the constraints
present in the running database as enforcement, and never assume the two agree.
Decide for each invariant whether the database or the application enforces it,
and say which. Prove a rule by observing a violating write being rejected, not
by observing a valid write succeeding. Apply this guidance only where a
relational store is present, and report techniques that do not apply.
