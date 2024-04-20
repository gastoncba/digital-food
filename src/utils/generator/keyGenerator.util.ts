export const generateKey = () => {
  const words = ['BOLSA', 'ALRMA', 'SOL', 'MAR', 'CIELO', 'LUNA', 'ESTRELLA', 'NUBE', 'RÍO', 'MONTAÑA', "COMIDA"];
  const aliasLength = 3;

  let alias = '';
  for (let i = 0; i < aliasLength; i++) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    alias += randomWord + (i < aliasLength - 1 ? '.' : '');
  }

  return alias;
}
