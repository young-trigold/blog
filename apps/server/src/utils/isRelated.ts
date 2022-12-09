const isRelated = (str1: string, str2: string) =>
  String(str1?.toLowerCase()).includes(String(str2?.toLowerCase())) ||
  String(str2?.toLowerCase()).includes(String(str1?.toLowerCase()));

export default isRelated;
