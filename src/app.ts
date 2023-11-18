
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

const removeDuplicates = (arr:any)=> { 
    return [...new Set(arr)]; 
} 

const cleanAndSplitString = async (str:string, category:string)=>{

    let returnArr:stringArr = [];
    // for terms, split into array by ',' and trim all whitespaces
    if (category=='terms') {
        returnArr =  str.split(',').map( (word) => {
            return word.trim(); 
        });
    }
    //for sentence, split into array by space, removing all leading and trailing punctuations
    else if (category =='sentence'){
        returnArr =  str.split(' ').map( (word) => {
            return word.replace(/^[^\w]+|[^\w]+$/g, '');
        })
    }
    return returnArr;
}

const categorizingWordsIntoObject = async (words:stringArr, category:string)=>{
    
    let return_Object: CheckObject = {
        firstPersonSingular:[],
        firstPersonPlural:[],
        secondPersonSingular:[],
        otherTerms:[],
        sequence:[]
    };

    for (const word of words) {
        let pushed:boolean = false;
        let sequenceKey:string = 'otherTerms'

        //i. Check if possible "I"in Sentence
        if (word ===`I` && category=='sentence') {
            return_Object['firstPersonSingular'].push(word)
            pushed = true;
            sequenceKey = 'firstPersonSingular'
        }

        //ii. Check if possible "I" or "i" in Terms
        if ( (word==='i' || word ==='I') && category=='terms') {
            return_Object['firstPersonSingular'].push(word)
            pushed = true;
            sequenceKey = 'firstPersonSingular'
        }

        //iii. Check for all possible pronouns
        for (const key in PROUNOUNS) {
            const Pronouns_Array:stringArr = PROUNOUNS[key];
            if (Pronouns_Array.includes( word.toLowerCase()) ){
                return_Object[key].push(word);
                pushed = true;
                sequenceKey = key; //breaking the inner for-of loop
                break;
            }
        }

        //iv. The rest will be words for non-pronouns checking
        if (!pushed) {
            return_Object["otherTerms"]?.push(word)
            pushed = true;
        };

        return_Object['sequence'].push(sequenceKey)
    };

    return_Object['sequence'] = removeDuplicates( return_Object['sequence'] );

    return return_Object;
};

const toPersonObj = async (str:string, category:string)=>{

    // 1. Split and clean up input sentence into an string array, according to category
    const Words:stringArr = await cleanAndSplitString(str, category)
    
    //2. Returning an Object with interface Person 
    return categorizingWordsIntoObject(Words, category);
}

const checkOtherTerms = (otherTerms:stringArr, sentence:stringArr)=>{
    
    let returnArr:stringArr = [];

    // Ensure checking will start only if neccessary
    if (otherTerms.length > 0) { 
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

const checkPronouns = ( sentenceToCheckObj:CheckObject, category:string)=>{
    
    let returnArr:stringArr = [];

    if (category === 'firstPersonSingular') {
        for (const iterator of sentenceToCheckObj[category]) {
            returnArr.push(iterator)
        }
    }
    else{
        returnArr = sentenceToCheckObj[category]
    };

    return returnArr
}

const countTermInstances = async (Sentence:string, Terms:string)=>{
    
    // Turn Sentences into an categorized Object
    const Sentence_Obj:CheckObject = await toPersonObj( Sentence, 'sentence' ); 

    // Turn Terms into an categorized Object
    const Terms_Obj:CheckObject= await toPersonObj( Terms, 'terms' ); 

    let returnArr:any = [];
    for (const category of Terms_Obj.sequence) {
        if (category == 'otherTerms') {
            returnArr.push( checkOtherTerms(Terms_Obj.otherTerms, Sentence_Obj.otherTerms) ) 
        }
        else{
           returnArr.push( checkPronouns(Sentence_Obj, category) );
        }
    }

    return removeDuplicates( returnArr );
}

(async () => {
    try {
        const Sentence:string = `i. The Customer is always right, ii. you are always wrong, iii. we should make ourshelves happy. I am happy for you!`
        const Terms:string = `you, Customer, we, i`;

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