# BlackRoad Math Probe Kit 🧮

A set of deep math prompts to interrogate agents about their actual understanding,
not just surface vibes.

Use these on: Enclave assistants, Claude, ChatGPT, etc.

---

## Probe A — Cantor Diagonal & Halting

> Explain Cantor’s diagonal argument **step by step** for why the real numbers in [0,1] are uncountable.  
> Then:  
> 1. Tell me exactly where “diagonalization” happens in the proof.  
> 2. Show how the *same pattern* appears in the proof that there is no Turing machine that decides the halting problem.  
> 3. In both cases, identify:
>    - the “list”  
>    - the “diagonal object”  
>    - the “flip operation”  
>    - the contradiction.

---

## Probe B — Hyperbolic vs Euclidean

> In Euclidean geometry, the parallel postulate says: through a point not on a line, there is exactly one parallel.  
> In hyperbolic geometry:
> 1. State the corresponding fact about parallels.  
> 2. Describe one model of the hyperbolic plane (Poincaré disk or upper half-plane) and explain **how you can see** the parallel behavior in that model.  
> 3. Give one concrete statement that is true in Euclidean geometry but false in hyperbolic geometry, and explain why.

---

## Probe C — Pascal & Fibonacci

> Show how the Fibonacci numbers can be found **inside Pascal’s triangle**.  
> 1. Describe exactly which entries you add to get Fₙ.  
> 2. Compute this explicitly in the triangle up to F₇.  
> 3. Then explain (informally is fine) why this diagonal-summing rule always gives Fibonacci numbers.

---

## Probe D — Integer Partitions vs Partition Functions

> There are two different “partition” ideas:  
> - integer partitions in number theory (ways to write n as a sum of positive integers), and  
> - partition functions in statistical mechanics (Z = Σ e^{-βE}).  
> 
> 1. Define each one clearly.  
> 2. For integer partitions, list all partitions of 5 and confirm there are 7.  
> 3. For a simple physical system with two energy levels 0 and ε, derive the canonical partition function Z(β) and the probability of each energy state.  
> 4. Explain whether these two “partition” concepts are actually related or mostly just share a name.

---

## Probe E — Growth & Hyperbolic Space

> Compare exponential, polynomial, and Fibonacci growth.  
> 1. Show that Fibonacci numbers grow asymptotically like φⁿ / √5 where φ is the golden ratio.  
> 2. Explain why that means Fibonacci growth is still “exponential type,” not something in-between.  
> 3. In a hyperbolic plane, the area of a circle grows exponentially with the radius (unlike Euclidean, where it’s ~r²).  
>    Explain, at a high level, why hyperbolic geometry naturally produces exponential growth phenomena.

---

## Probe F — Meta-Diagonalization

> Diagonalization often produces an object “outside” a list (like a real not in the enumeration, or a machine that breaks a halting decider).  
> Suppose we take all the explanations you just gave about diagonalization and list them in some canonical order.  
> 1. Describe what it would mean to “diagonalize against” your own explanations.  
> 2. Is there a kind of explanation about diagonalization that your previous answers **cannot** capture? If so, describe its shape. If not, explain why.

