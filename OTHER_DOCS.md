# Tikz examples

````latex
```tikz
\begin{document}
  \begin{tikzpicture}

  % Draw grid
  \draw[step=1cm,very thin,color=black!50] (-5,-5) grid (5,5);

  % Draw axes
  \draw[->] (-4.2,0) -- (4.2,0) node[below] {$x$};
  \draw[->] (0,-4.2) -- (0,4.2) node[right] {$y$};

  % Draw absolute value function
  \draw[thick,blue,domain=-4:4] plot (\x,{abs(\x)}) node[right] {$y = |x|$};

  % Draw horizontal line y=2
  \draw[thick,green!80!black] (-4,2) -- (4,2) node[right] {$y = 2$};

  % Labels for specific points
  \node[below] at (1,0) {1};
  \node[left] at (0,1) {1};

  \end{tikzpicture}
\end{document}
```
````

````latex
```tikz

\begin{document}
\begin{tikzpicture}

    % Draw grid
    \draw[step=1cm,very thin,color=black!50] (-5,-2) grid (5,6);

    % Draw axes
    \draw[->] (-4.2,0) -- (4.2,0) node[below] {$x$};
    \draw[->] (0,-2.1) -- (0,5.2) node[right] {$y$};

    % Draw absolute value function
    \draw[thick,blue,domain=-2.5:2.5] plot (\x,{pow(\x, 2)}) node[right] {$y = x^2$};

    % Labels for specific points
    \node[below] at (1,0) {1};
    \node[left] at (0,1) {1};

\end{tikzpicture}
\end{document}

```
````

````latex
Užrašykite parabolės, kurios pavaizduotas grafikas, formulę
pavidalu $f(x) = ax^2 + bx + c$.

```tikz
\begin{document}
  \begin{tikzpicture}

    % Draw grid
    \draw[step=1cm,very thin,color=black!50] (-4,-4) grid (2,4);

    % Draw axes
    \draw[->] (-4.2,0) -- (2.2,0) node[below] {$x$};
    \draw[->] (0,-4.1) -- (0,3.2) node[right] {$y$};

    % Draw absolute value function
    \draw[thick,blue,domain=-3.7:1.7] plot (\x,{pow(\x, 2) + 2 * \x - 3});

    % Labels for specific points
    \node[below] at (1,0) {1};
	\node[left] at (0,1) {1};

  \end{tikzpicture}
\end{document}
```
````

# Latex examples

```latex
Formulė bus maža $\frac{x^2+23x}{\int_2^3 3 dx}$\
Formulė bus didelė $\displaystyle \frac{x^2+23x}{\int_2^3 3 dx}$\
Formulė bus didelė ir centruota
$$
\frac{x^2+23x}{\int_2^3 3 dx}
$$

```
