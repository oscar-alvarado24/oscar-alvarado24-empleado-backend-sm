export interface SESService{
    registerEmailInSes(email:string):Promise<void>
}