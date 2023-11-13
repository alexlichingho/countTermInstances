"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Defining const Pronouns for crossing checkings.
const Pronouns = {
    firstPersonSingular: ["I", "me", "my", "mine", "myself"],
    firstPersonPlural: ["we", "us", "our", "ours", "ourshelves"],
    secondPersonSingular: ["you", "your", "yourself"]
};
const cleanAndSplitString = (str) => __awaiter(void 0, void 0, void 0, function* () {
    return str.replace(/[\p{P}$+<=>^`|~]/gu, '').split(/\b\W+\b/).filter(word => word.length > 0);
});
const categorizingWordsIntoObject = (words) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let return_Object = {
        firstPersonSingular: [],
        firstPersonPlural: [],
        secondPersonSingular: [],
        otherTerms: []
    };
    for (const word of words) {
        let pushed = false;
        //i. Check if possible Capital I in the Sentence
        if (word === `I`) {
            return_Object['firstPersonSingular'].push(word);
            pushed = true;
        }
        //ii. Check for all possible pronouns
        for (const key in Pronouns) {
            const Pronouns_Array = Pronouns[key];
            if (Pronouns_Array.includes(word.toLowerCase())) {
                return_Object[key].push(word);
                pushed = true;
                break;
            }
        }
        //iii. The rest will be words for non-pronouns checking
        if (!pushed) {
            (_a = return_Object["otherTerms"]) === null || _a === void 0 ? void 0 : _a.push(word);
            pushed = true;
        }
    }
    ;
    return return_Object;
});
const toPersonObj = (str) => __awaiter(void 0, void 0, void 0, function* () {
    //1. Split and clean up input sentence into an string array  
    const Words = yield cleanAndSplitString(str);
    //2. Returning an Object with interface Person 
    return categorizingWordsIntoObject(Words);
});
const checkOtherTerms = (otherTerms, sentence) => __awaiter(void 0, void 0, void 0, function* () {
    let returnArr = [];
    if (otherTerms.length > 0) { // Ensure checking will start only if neccessary
        for (const TermToCheck of otherTerms) {
            for (const otherTerm of sentence) {
                if (otherTerm.toLowerCase() === TermToCheck.toLowerCase()) { // Transform into lowercase only during checking
                    returnArr.push(otherTerm);
                }
            }
        }
    }
    ;
    return returnArr;
});
const checkPronouns = (termsToCheckObj, sentenceToCheckObj) => __awaiter(void 0, void 0, void 0, function* () {
    let returnArr = [];
    // Loop through keys of const Pronouns:firstPersonSingular, firstPersonPlural, secondPersonSingular
    for (const pronoun in Pronouns) {
        // Since all pronouns in the sentence have been checked and categorized, 
        // just push the whole string array as result when specific pronoun check is neccessary
        if (termsToCheckObj[pronoun].length > 0) {
            returnArr.push(sentenceToCheckObj[pronoun]);
        }
    }
    ;
    return returnArr;
});
const countTermInstances = (Sentence, Terms) => __awaiter(void 0, void 0, void 0, function* () {
    const Sentence_Obj = yield toPersonObj(Sentence); // Turn Sentences into an categorized Object
    const Terms_Obj = yield toPersonObj(Terms); // Turn Terms into an categorized Object
    // Returning a flattened String Array after cross checkings Pronouns and other terms
    return [
        ...yield checkOtherTerms(Terms_Obj.otherTerms, Sentence_Obj.otherTerms),
        ...yield checkPronouns(Terms_Obj, Sentence_Obj)
    ]
        .flat();
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Sentence = `The Customer is always right`;
        const Terms = `Customer, you`;
        console.log(`
        The Sentence to be check is: 
        ${Sentence},
        
        The Terms (seperated by comma) are:
        ${Terms}

        Please edit them by changing the const: Sentence or const:Terms
        `);
        const List_of_terms = yield countTermInstances(Sentence, Terms);
        console.log(List_of_terms);
    }
    catch (e) {
        // Deal with the fact the chain failed
        console.log(e);
    }
}))();
