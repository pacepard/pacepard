import slugify from "slugify";


export const checkUniqueName = async (Model: any, name: string) => {
    // check if user already exists
    const existingUser = await Model.findOne({ username: slugifyString(name) });
  
    if (existingUser) return true;
    else return false;
  };
  
  export const slugifyString = (arg: string) => {
    const val = slugify(arg, { lower: true, trim: true });
    return val;
  };
  
  export const createUniqueFileName = (arg: string, ext: string) => {
    const val = slugifyString(arg);
    const fileName = `${val}-${Date.now()}.${ext}`;
  
    return fileName;
  };