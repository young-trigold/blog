let count = 0;

const getUniqueID = () => (Math.random() + count++).toString(32);

export default getUniqueID;
