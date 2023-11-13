# countTermInstances
A function that counts the number of times a string containing comma separated terms is found in a piece of text

Written in Typescript

To run, use git pull and run the below in the command line:
node src/app.js

Please edit the test sentence and terms by changing the const: Sentence or const:Terms in file src/app.ts, then compile by typing:
npx tsc -p tsconfig.json

or in watch mode:
npx tsc -p tsconfig.json --watch

Description:

1. Created an object named "PROUNOUNS" with interface "Person", which stores and categrorized all the pronouns: firstPersonSingular, firstPersonPlural, secondPersonSingular

2. Clean up sentence/ terms by removing all punctuations and splited by whitespace into text array.

3. Each words in the text array to be checked with "PROUNOUNS" and put into an Object which has 4 categories: firstPersonSingular, firstPersonPlural, secondPersonSingular + otherTerms. Pronouns will be be corresponding pronoun category, the rest of the words will be put into the "otherTerms" category.

"I" is a special case so it has be to checked in top priority.

Now there are 2 objects: "Sentence_Obj" & "Terms_Obj", we will be cross checking them.

4. Created a text array: "List_of_terms" to store the returned check result.

5. Check the non-pronons words using an async function checkOtherTerms(). Only text arrays from "Sentence_Obj" and "Terms_Obj" will be used. Return result in text array into "List_of_terms".

6. Check the pronons words using an async function checkPronouns(). By looping through the keys of object "PROUNOUNS": firstPersonSingular, firstPersonPlural, secondPersonSingular, if there is any element exists in the array of "Terms_Obj[key]", the text array of "Sentence_Obj[key]" will be pushed into "List_of_terms".

7. Flatten "List_of_terms" and output.
