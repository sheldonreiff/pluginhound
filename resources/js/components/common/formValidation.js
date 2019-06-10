export const getErrorMessage = (errors, paths) => {
    const pathArray = Array.isArray(paths) ? paths : [paths];
    for(let i = 0; i < pathArray.length; i++){
        const match = errors.find(value => {
            return value.path === pathArray[i];
        });
        if(match){
            return match.message;
        }
    }
    return false;
}

class FormValidator{
    constructor(schemas){
        this.submitted = false;
        this.schemas = Array.isArray(schemas) ? schemas : [schemas];
    }

    isValid(errors){
        return errors.length === 0;
    }

    readyToSubmit(state){
        this.submitted = true;
        return this.isValid(this.validate(state));
    }

    validate(state, options = {strip: false}){
        let res = [];
        if(this.submitted){
            this.schemas.forEach(schema => {
                res = res.concat(schema.validate(state, options));
            });
        }
        return res;
    }
    
    reset(){
        this.submitted = false;
    }
}

export default FormValidator;