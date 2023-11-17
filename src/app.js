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
const PROUNOUNS = {
    firstPersonSingular: ["I", "me", "my", "mine", "myself"],
    firstPersonPlural: ["we", "us", "our", "ours", "ourshelves"],
    secondPersonSingular: ["you", "your", "yourself"]
};
var CheckObjectSequence;
(function (CheckObjectSequence) {
    CheckObjectSequence[CheckObjectSequence["firstPersonSingular"] = 0] = "firstPersonSingular";
    CheckObjectSequence[CheckObjectSequence["firstPersonPlural"] = 1] = "firstPersonPlural";
    CheckObjectSequence[CheckObjectSequence["secondPersonSingular"] = 2] = "secondPersonSingular";
    CheckObjectSequence[CheckObjectSequence["otherTerms"] = 3] = "otherTerms";
})(CheckObjectSequence || (CheckObjectSequence = {}));
const removeDuplicates = (arr) => {
    return [...new Set(arr)];
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
        otherTerms: [],
        sequence: []
    };
    let sequenceArray = [];
    for (const word of words) {
        let pushed = false;
        let sequenceKey = 'otherTerms';
        //i. Check if possible Capital I in the Sentence
        if (word === `I`) {
            return_Object['firstPersonSingular'].push(word);
            pushed = true;
            sequenceKey = 'firstPersonSingular';
        }
        //ii. Check for all possible pronouns
        for (const key in PROUNOUNS) {
            const Pronouns_Array = PROUNOUNS[key];
            if (Pronouns_Array.includes(word.toLowerCase())) {
                return_Object[key].push(word);
                pushed = true;
                sequenceKey = key;
                break;
            }
        }
        //iii. The rest will be words for non-pronouns checking
        if (!pushed) {
            (_a = return_Object["otherTerms"]) === null || _a === void 0 ? void 0 : _a.push(word);
            pushed = true;
            sequenceKey = 'otherTerms';
        }
        ;
        return_Object['sequence'].push(sequenceKey);
    }
    ;
    return_Object['sequence'] = removeDuplicates(return_Object['sequence']);
    console.log(return_Object['sequence']);
    return return_Object;
});
const toPersonObj = (str) => __awaiter(void 0, void 0, void 0, function* () {
    //1. Split and clean up input sentence into an string array  
    const Words = yield cleanAndSplitString(str);
    //2. Returning an Object with interface Person 
    return categorizingWordsIntoObject(Words);
});
const checkOtherTerms = (otherTerms, sentence) => {
    console.log(`checkOtherTerms`);
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
};
const checkPronouns = (termsToCheckObj, sentenceToCheckObj, iterator) => {
    console.log(`checkPronouns, iterator = ${iterator}`);
    let returnArr = [];
    // Loop through keys of const Pronouns:firstPersonSingular, firstPersonPlural, secondPersonSingular
    // for (const pronoun in PROUNOUNS) { 
    //     // Since all pronouns in the sentence have been checked and categorized, 
    //     // just push the whole string array as result when specific pronoun check is neccessary
    //     if (termsToCheckObj[pronoun].length > 0 ) {
    //         returnArr.push(sentenceToCheckObj[pronoun])
    //     }    
    // };
    for (const element of sentenceToCheckObj[iterator]) {
        returnArr.push(element);
    }
    return returnArr;
};
const countTermInstances = (Sentence, Terms) => __awaiter(void 0, void 0, void 0, function* () {
    const Sentence_Obj = yield toPersonObj(Sentence); // Turn Sentences into an categorized Object
    const Terms_Obj = yield toPersonObj(Terms); // Turn Terms into an categorized Object
    // Returning a flattened String Array after cross checkings Pronouns and other terms
    // return [
    //         ...await checkOtherTerms(Terms_Obj.otherTerms, Sentence_Obj.otherTerms),
    //         ...await checkPronouns(Terms_Obj, Sentence_Obj)
    // ]
    // .flat();
    console.log(`Sentence_Obj = ${JSON.stringify(Sentence_Obj)}`);
    console.log(`Terms_Obj = ${JSON.stringify(Terms_Obj)}`);
    let returnArr = [];
    for (const iterator of Terms_Obj.sequence) {
        console.log(`iterator = ${iterator}`);
        if (iterator == 'otherTerms') {
            returnArr.push(checkOtherTerms(Terms_Obj.otherTerms, Sentence_Obj.otherTerms));
        }
        else {
            returnArr.push(checkPronouns(Terms_Obj, Sentence_Obj, iterator));
        }
    }
    returnArr = removeDuplicates(returnArr);
    return returnArr;
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const Sentence:string = `The Customer is always right`
        // const Terms:string = `Customer, you`;
        const Sentence = `i. The Customer is always right, ii. you are always wrong, iii. we should make ourshelves happy`;
        const Terms = `you, Customer, we, us`;
        console.log(`
        The Sentence to be check is: 
        ${Sentence},
        
        The Terms (seperated by comma) are:
        ${Terms}

        Please edit them by changing the const: Sentence or const:Terms
        `);
        let List_of_terms = yield countTermInstances(Sentence, Terms);
        List_of_terms = List_of_terms.flat();
        console.log(List_of_terms);
    }
    catch (e) {
        // Deal with the fact the chain failed
        console.log(e);
    }
}))();
