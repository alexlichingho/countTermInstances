
type stringArr =string[];

interface Person {
	firstPersonSingular: stringArr;
	firstPersonPlural: stringArr;
	secondPersonSingular: stringArr;
    otherTerms?: stringArr; //Optional 
    [key: string]: any;
}

// Defining const Pronouns for crossing checkings.
const PROUNOUNS: Person = {
    firstPersonSingular: ["I", "me", "my", "mine", "myself"],
    firstPersonPlural: ["we", "us", "our", "ours", "ourshelves"],
    secondPersonSingular: ["you", "your", "yourself"]
};


const cleanAndSplitString = async (str:string)=>{
    return str.replace(/[\p{P}$+<=>^`|~]/gu, '').split(/\b\W+\b/).filter(word => word.length > 0);
}

const categorizingWordsIntoObject = async (words:stringArr)=>{
    
    let return_Object: Person = {
        firstPersonSingular:[],
        firstPersonPlural:[],
        secondPersonSingular:[],
        otherTerms:[]
    };

    for (const word of words) {
        let pushed:boolean = false;

        //i. Check if possible Capital I in the Sentence
        if (word ===`I`) {
            return_Object['firstPersonSingular'].push(word)
            pushed = true;
        }

        //ii. Check for all possible pronouns
        for (const key in PROUNOUNS) {
            const Pronouns_Array:stringArr = PROUNOUNS[key];
            if (Pronouns_Array.includes( word.toLowerCase()) ){
                return_Object[key].push(word);
                pushed = true;
                break;
            }
        }

        //iii. The rest will be words for non-pronouns checking
        if (!pushed) {
            return_Object["otherTerms"]?.push(word)
            pushed = true;
        }
    };
    
    return return_Object;
};

const toPersonObj = async (str:string)=>{

    //1. Split and clean up input sentence into an string array  
    const Words:stringArr = await cleanAndSplitString(str)
    
    //2. Returning an Object with interface Person 
    return categorizingWordsIntoObject(Words);
}

const checkOtherTerms = async (otherTerms:stringArr, sentence:stringArr)=>{

    let returnArr:stringArr = [];

    if (otherTerms.length > 0) { // Ensure checking will start only if neccessary
        for (const TermToCheck of otherTerms) {
            for (const otherTerm of sentence) {
                if (otherTerm.toLowerCase() === TermToCheck.toLowerCase() ) { // Transform into lowercase only during checking
                    returnArr.push(otherTerm) 
                }
            }
        }
    };

    return returnArr;
};

const checkPronouns = async (termsToCheckObj:Person, sentenceToCheckObj:Person)=>{

    let returnArr:stringArr = [];

    // Loop through keys of const Pronouns:firstPersonSingular, firstPersonPlural, secondPersonSingular
    for (const pronoun in PROUNOUNS) { 
        // Since all pronouns in the sentence have been checked and categorized, 
        // just push the whole string array as result when specific pronoun check is neccessary
        if (termsToCheckObj[pronoun].length > 0 ) {
            returnArr.push(sentenceToCheckObj[pronoun])
        }    
    };

    return returnArr;
}

const countTermInstances = async (Sentence:string, Terms:string)=>{
    
    const Sentence_Obj:Person = await toPersonObj( Sentence ); // Turn Sentences into an categorized Object
    const Terms_Obj:Person= await toPersonObj( Terms ); // Turn Terms into an categorized Object

    // Returning a flattened String Array after cross checkings Pronouns and other terms
    return [
            ...await checkOtherTerms(Terms_Obj.otherTerms, Sentence_Obj.otherTerms),
            ...await checkPronouns(Terms_Obj, Sentence_Obj)
    ]
    .flat();
}

(async () => {
    try {
        const Sentence:string = `The Customer is always right`
        const Terms:string = `Customer, you`;

        console.log(`
        The Sentence to be check is: 
        ${Sentence},
        
        The Terms (seperated by comma) are:
        ${Terms}

        Please edit them by changing the const: Sentence or const:Terms
        `);
        

        const List_of_terms = await countTermInstances(Sentence, Terms);
        console.log(List_of_terms);
    } catch (e) {
        // Deal with the fact the chain failed
        console.log(e);
    }
})();