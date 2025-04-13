export interface CognitoService{
    createCognitoUser(email:string, position:string):Promise<any>
    deleteCognitoUser(email:string):Promise<void>
}