import bcrypt from 'bcrypt';


export const hashPw = async (pw) =>{
    const salt = await bcrypt.genSalt(10);

    const newPw = await bcrypt.hash(pw, salt);

    return newPw
}
export const comparePw = async (candidatePw,hashedPw) =>{
    const match = await bcrypt.compare(candidatePw,hashedPw)
    return match
}