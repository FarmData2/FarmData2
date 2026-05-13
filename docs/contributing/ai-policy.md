# FarmData2 AI Policy

## Introduction

Unclear
Currently, the user writing the prompts own's the output of most LLM's.
The current status in the US is that human authorship is required for copyright.
Therefore, the output of a model generated from a prompt cannot currently be copyrighted.
Further, fixed tangible expressions are copyrightable, ideas are not.
A prompt is the expression of an idea (and thus as a fixed expression could be copyrighted).
The copyrightability of the output of a model in response to that prompt howver, is a separate issue.
While the prompt exprsses the idea, it does not allow the prompter sufficent control over the expression of the idea to grant authorship.
This issue is compunded the randomness in the outputs and further by systems that rewrite prompts or formulate plans executed by other AI agents.


However, 
The human elements identified separate from AI generated elements are copyrightable in a combined work, if they are sufficently deliniated.
Further, modification, transformation, creative selection or arangments of the AI-generated expresssions the full expression may be copyrightable (I think)
- significant transformation, creative selection or arangement, and modification can create a copyrightable work from individual pieces that themselves are not copyrightable.
- does the iterative nature of revision of the work matter?
  - their analysis was pre-agenic
  - they argue that that would only make it more so
- The use of AGENTS.md and the current codebase may help
  - this is creative input that constrains the expressive elments of the model output (unclear if sufficently)


full rationalle in [Copyright and Artificial Intelligence](https://copyright.gov/ai/)
[Copyright and Artificial Intelligence - Part 2: Copyrightability](https://copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf)
Part 2 was published on January 29, 2025, and addresses the copyrightability of outputs created using generative AI.


## Conclusion...
The GPL is DOA in the AI era.

## Policy




- Human commits between AI prompts?
  - Commit pieces you write or changes you make manually separately.

- Human written source code is copyrightable, the executable program (e.g. the UI) is not (I think).
- Can the AGENTS.md file help too in that it is affecting the expression created from the prompt.
- Is the new mode of conversation and "partnering with AI" enough to push this to joint authorship?
- AI enhanced auto-complete is generally thought to be fine.

## Sources


[Assisted-by: How open source projects are drawing the line on AI contributions](https://allthingsopen.org/articles/open-source-ai-contributions-assisted-by-git-trailer-standard)

[ASF Generative Tooling Guidance](https://www.apache.org/legal/generative-tooling.html)
- The Apache-2.0 license, and the Apache Individual Contribution License Agreement, both remind contributors that they are responsible for disclosing any copyrighted materials in submitted contributions that are not their original creation. This is as true when using generative AI tooling, as it is when using materials from public websites or code from other open-source projects.

[](https://natlawreview.com/article/who-owns-ai-generated-content-human-authorship-still-controls-and-documenting)
In 2025, the D.C. Circuit confirmed that the Copyright Act requires human authorship and does not permit copyright registration for works generated autonomously by AI.
The Copyright Office has taken the same position: AI-assisted works may be protectable, but purely AI-generated material, or material reflecting insufficient human control over expressive elements, is not.
For businesses, the practical question is not whether AI may be used to create content — it may. The question is whether the business can identify and document enough human-authored expression to support ownership, registration and enforcement.

The Copyright Office’s 2023 registration guidance and 2025 AI report follow the same approach. The Office explained that when a machine produces a work’s “traditional elements of authorship,” the work lacks human authorship and is not registrable.4 The 2025 report likewise states that copyright does not extend to “purely AI-generated material, or material where there is insufficient human control over the expressive elements,” while recognizing that copyright may protect human-authored elements in AI-assisted works, including creative selection, arrangement, and modification.5

For businesses, then, the key inquiry is whether the final work contains enough human-authored expression to support copyright protection.

One of the clearest practical points in the Copyright Office’s guidance is that prompting, by itself, generally does not establish authorship. The 2025 report states that prompts alone do not provide sufficient control over the expressive elements of current AI outputs. The 2023 guidance likewise explains that prompts may describe the desired result, but the system determines how those instructions are expressed.

Under the Copyright Office’s current view, the stronger ownership argument comes from meaningful human revision, selection, arrangement, transformation or incorporation of AI-generated material into a larger human-authored work.

Courts also do not treat a copyrighted work as entirely protected or entirely unprotected. In practice, that means a court may protect only the human-created aspects of a work — such as substantial edits, creative arrangement or other original modifications — while treating the underlying AI-generated material as unprotectable.


Currently an excellent analysis: 	07/18/2025
[Generative Artificial Intelligence and Copyright Law](https://www.congress.gov/crs-product/LSB10922)
the Copyright Act affords copyright protection to "original works of authorship." While the Constitution and Copyright Act do not explicitly define who (or what) may be an "author," U.S. courts to date have not recognized copyright in works that lack a human author—including works created autonomously by AI systems.
Before the proliferation of generative AI, U.S. courts did not extend copyright protection to various nonhuman authors, holding that a monkey who took photos of himself lacked standing to sue under the Copyright Act; that human authorship was required to copyright a book purportedly inspired by celestial beings; and that a living garden could not be copyrighted. The U.S. Copyright Office has also long maintained that copyrighted works must be "created by a human being" and therefore refused to register works that are "produced by a machine or mere mechanical process that operates randomly or automatically without any creative input or intervention from a human author."
the AI Guidance states that "what matters is the extent to which the human had creative control over the work's expression." Thus, the AI Guidance states, when AI "determines the expressive elements of its output, the generated material is not the product of human authorship."
On the other hand, works containing AI-generated material may be copyrighted under some circumstances, such as "sufficiently creative" human arrangements or modifications of AI-generated material or works that combine AI-generated and human-authored material. The AI Guidance states that authors may claim copyright protection only "for their own contributions" to such works, and they must identify and disclaim AI-generated parts of the works when applying to register their copyright.
Three copyright registration denials highlighted by the Copyright Office illustrate that, in general, the office will not find human authorship where an AI program generates works in response to user prompts
[Zarya of the Dawn](https://www.copyright.gov/docs/zarya-of-the-dawn.pdf): A February 2023 decision that AI-generated illustrations for a graphic novel were not copyrightable, although the human-authored text of the novel and overall selection and arrangement of the images and text in the novel could be copyrighted.
[Théâtre D'opéra Spatial](https://www.copyright.gov/rulings-filings/review-board/docs/Theatre-Dopera-Spatial.pdf): A September 2023 decision that an artwork generated by AI and then modified by the applicant could not be copyrighted, since the applicant failed to identify and disclaim the AI-generated portions as required by the AI Guidance.

In January 2025, the Copyright Office published the part of its Copyright and Artificial Intelligence report addressing the copyrightability of AI-generated works. Reinforcing the AI Guidance's emphasis on "creative control," the report concludes that, "given current generally available technology, prompts alone do not provide sufficient human control to make users of an AI system the authors of the output." The report contends that the Copyright Act's distinction between copyrightable "works" and noncopyrightable "ideas" precludes copyrightability for works generated by AI in response to user prompts. Specifically, the report argues, "‍‍[p]rompts essentially function as instructions that convey unprotectible ideas" and "do not control how the AI system processes them in generating the output." 

The office contends that new legislation regarding "the copyrightability of AI-generated material" is currently not needed, indicating that courts "will provide further guidance on the human authorship requirement as it applies to specific uses of AI" and that, since each work must be analyzed individually, "greater clarity would be difficult to achieve" through legislation.

[Copyright and Artificial Intelligence](https://copyright.gov/ai/)
[Copyright and Artificial Intelligence - Part 2: Copyrightability](https://copyright.gov/ai/Copyright-and-Artificial-Intelligence-Part-2-Copyrightability-Report.pdf)
Part 2 was published on January 29, 2025, and addresses the copyrightability of outputs created using generative AI.
Section II provides a brief background on the technologies involved. It then summarizes
the existing legal framework, particularly the human authorship requirement, the
idea/expression dichotomy, and the originality standard for copyright protection.
- The use of AI tools to assist rather than stand in for human creativity does not affect the availability of copyright protection for the output.
- Copyright protects the original expression in a work created by a human author, even if the work also includes AI-generated material.
- Copyright does not extend to purely AI-generated material, or material where there is insufficient human control over the expressive elements.
- Whether human contributions to AI-generated outputs are sufficient to constitute authorship must be analyzed on a case-by-case basis.
- Based on the functioning of current generally available technology, prompts do not alone provide sufficient control.
- Human authors are entitled to copyright in their works of authorship that are perceptible in AI-generated outputs, as well as the creative selection, coordination, or arrangement of material in the outputs, or creative modifications of the outputs.

As the Office affirmed in the Guidance, copyright protection in the United States
requires human authorship. This foundational principle is based on the Copyright Clause in
the Constitution and the language of the Copyright Act as interpreted by the courts. The
Copyright Clause grants Congress the authority to “secur[e] for limited times to authors . . . the
exclusive right to their . . . writings.”33 As the Supreme Court has explained, “the author [of a
copyrighted work] is . . . the person who translates an idea into a fixed, tangible expression
entitled to copyright protection.”3

Although entering prompts into a generative AI system can be seen as similar to providing
instructions to an artist commissioned to create a work, there are key differences. In a human-
to-human collaboration, the hiring party is able to oversee, direct, and understand the
contributions of a commissioned human artist. Depending on the nature of each party’s
contributions, the artist may be the sole author, or the outcome may be a joint work or work made for hire.

The gaps between prompts and resulting outputs demonstrate that the user lacks control
over the conversion of their ideas into fixed expression, and the system is largely responsible for
determining the expressive elements in the output.

where human-authored inputs are reflected in the output, they contribute more than just an
intellectual conception. One explained that “a human author who inputs their own illustration
or media file” into an AI system “may have a greater claim to authorship,” because “there is a
limited range of specific expressive output that is objectively foreseeable as a result of a human
user’s” contribution.

Just as derivative work protection is limited to the material added
by the later author,125 copyright in this type of AI-generated output would cover the perceptible
human expression. It may also cover the selection, coordination, and arrangement of the
human-authored and AI-generated material, even though it would not extend to the AI-
generated elements standing alone.
