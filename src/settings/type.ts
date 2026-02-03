export type FecthResult <T> =
{
    success:true
    data:T
}
|{
    success:false
    error:string
    status:number
}