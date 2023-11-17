
type stringArr =string[];

interface Person {
	firstPersonSingular: stringArr;
	firstPersonPlural: stringArr;
	secondPersonSingular: stringArr;
    [key: string]: any;
}

interface CheckObject extends Person {
    otherTerms?: stringArr; //Optional 
}

// Defining const Pronouns for crossing checkings.
const PROUNOUNS: Person = {
    firstPersonSingular: ["I", "me", "my", "mine", "myself"],
    firstPersonPlural: ["we", "us", "our", "ours", "ourshelves"],
    secondPersonSingular: ["you", "your", "yourself"]
};

enum CheckObjectSequence {
    firstPersonSingular, 
    firstPersonPlural, 
    secondPersonSingular, 
    otherTerms,
}


const removeDuplicates = (arr:any)=> { 
    return [...new Set(arr)]; 
} 

const cleanAndSplitString = async (str:string)=>{
    return str.replace(/[\p{P}$+<=>^`|~]/gu, '').split(/\b\W+\b/).filter(word => word.length > 0);
}

const categorizingWordsIntoObject = async (words:stringArr)=>{
    
    let return_Object: CheckObject = {
        firstPersonSingular:[],
        firstPersonPlural:[],
        secondPersonSingular:[],
        otherTerms:[],
        sequence:[]
    };

    let sequenceArray:number[] = [];

    for (const word of words) {
        let pushed:boolean = false;
        let sequenceKey:string = 'otherTerms'
        //i. Check if possible Capital I in the Sentence
        if (word ===`I`) {
            return_Object['firstPersonSingular'].push(word)
            pushed = true;
            sequenceKey = 'firstPersonSingular'
        }

        //ii. Check for all possible pronouns
        for (const key in PROUNOUNS) {
            const Pronouns_Array:stringArr = PROUNOUNS[key];
            if (Pronouns_Array.includes( word.toLowerCase()) ){
                return_Object[key].push(word);
                pushed = true;
                sequenceKey = key;
                break;
            }
        }

        //iii. The rest will be words for non-pronouns checking
        if (!pushed) {
            return_Object["otherTerms"]?.push(word)
            pushed = true;
            sequenceKey = 'otherTerms';
        };

        return_Object['sequence'].push(sequenceKey)
    };

    return_Object['sequence'] = removeDuplicates( return_Object['sequence'] );

    console.log(return_Object['sequence']);
    
    
    return return_Object;
};

const toPersonObj = async (str:string)=>{

    //1. Split and clean up input sentence into an string array  
    const Words:stringArr = await cleanAndSplitString(str)
    
    //2. Returning an Object with interface Person 
    return categorizingWordsIntoObject(Words);
}

const checkOtherTerms = (otherTerms:stringArr, sentence:stringArr)=>{
    console.log(`checkOtherTerms`);
    
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

const checkPronouns = (termsToCheckObj:CheckObject, sentenceToCheckObj:CheckObject, key:string)=>{
    
    let returnArr:stringArr = [];

    returnArr.push(sentenceToCheckObj[key])
    return returnArr;
}

const countTermInstances = async (Sentence:string, Terms:string)=>{
    
    const Sentence_Obj:CheckObject = await toPersonObj( Sentence ); // Turn Sentences into an categorized Object
    const Terms_Obj:CheckObject= await toPersonObj( Terms ); // Turn Terms into an categorized Object

    let returnArr:any = [];
    for (const iterator of Terms_Obj.sequence) {
        if (iterator == 'otherTerms') {
            returnArr.push( checkOtherTerms(Terms_Obj.otherTerms, Sentence_Obj.otherTerms) ) 
        }
        else{
           returnArr.push( checkPronouns(Terms_Obj, Sentence_Obj, iterator) );
        }
    }

    returnArr = removeDuplicates( returnArr );

    return returnArr;

}

(async () => {
    try {
        // const Sentence:string = `The Customer is always right`
        // const Terms:string = `Customer, you`;

        const Sentence:string = `i. The Customer is always right, ii. you are always wrong, iii. we should make ourshelves happy`
        const Terms:string = `you, Customer, we, us`;

        console.log(`
        The Sentence to be check is: 
        ${Sentence},
        
        The Terms (seperated by comma) are:
        ${Terms}

        Please edit them by changing the const: Sentence or const:Terms
        `);
        

        let List_of_terms = await countTermInstances(Sentence, Terms);
        List_of_terms = List_of_terms.flat(2);

        console.log(List_of_terms); //result
    } catch (e) {
        // Deal with the fact the chain failed
        console.log(e);
    }
})();