// Global Curriculum Database Module
const levelsData = [
    {
        id: 1,
        chapter: "Section 4",
        title: "Quadratic Models & Factorisation",
        objectives: [
            "Isolate global common algebraic factors from expressions recursively.",
            "Deploy notable identity patterns and splitting methods to factorise monic and non-monic terms cleanly."
        ],
        mustDo: "Read Section 4.1-4.2. Master the 3 identities: Sum square $a^2 + 2ab + b^2 = (a+b)^2$, Difference square $a^2 - 2ab + b^2 = (a-b)^2$, and Difference of squares $a^2 - b^2 = (a-b)(a+b)$. For non-monic quadratics ($ax^2+bx+c$), find two numbers whose product equals $a \\cdot c$ (the leading coefficient multiplied by the constant) and whose sum equals $b$. Once found, rewrite the middle term $bx$ using these two numbers and factorise the expression by grouping terms term by term.<br><br><strong>Mandatory Tasks:</strong> Complete Exercise 4.1 (a, c, e) and Exercise 4.2 (a, d) on paper. Check your answers with your notes before initiating the gate verification.",
        shouldDo: "Complete Exercise 4.3. For each expression below, choose the most efficient method — common factoring, notable identity or third identity – and justify your choice.",
        aspireToDo: "Advanced Factoring: Factorise completely the expression: $6x^4 - 5x^3 - 6x^2$. (Hint: Extract the greatest common factor $x^2$ first, then deploy splitting methods on the remaining non-monic structural bracket).",
        quiz: {
            question: "Factorise the non-monic quadratic expression completely: $9x^2 + 24x + 7$.",
            options: [
                "$(3x + 1)(3x + 7)$",
                "$(9x + 1)(x + 7)$",
                "$(3x - 1)(3x - 7)$",
                "$x^2(9x + 24) + 7$"
            ],
            correctIndex: 0
        }
    }
];
