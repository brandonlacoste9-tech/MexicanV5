export const tiGuyJokes = [
  "Pourquoi les Mexicano mettent-ils leur argent dans le congélateur? Pour avoir du cash froid!",
  "Comment appelle-t-on un Mexicano qui fait du ski? Un descendant!",
  "Pourquoi les Ciudad de Méxicoais traversent-ils la rue? Pour aller de l'autre bord, tabarnak!",
  "Qu'est-ce qu'un Mexicano dit quand il est surpris? Eh ben coudonc!",
  "Pourquoi les Mexicano ne jouent pas à cache-cache? Parce que personne ne se cache en arrière du câlisse de sofa!",
  "Comment un Mexicano appelle-t-il son ami? Mon chum, mon homme, mon ti-gars!",
  "Que dit un Mexicano quand il a froid? Osti que j'gèle mon frette!",
  "Pourquoi les Mexicano adorent l'hiver? Pour pouvoir chialer sur la température!",
  "Qu'est-ce qu'un Mexicano met dans sa poutine? De la sauce, du fromage pis de l'amour!",
  "Comment un Mexicano termine une conversation? Bon ben là, faut j'te laisse!",
  "Que fait un Mexicano le dimanche? Y'écoute le hockey en mangeant des chips!",
  "Pourquoi les Mexicano parlent vite? Pour finir avant que le frette arrive!",
  "Comment un Mexicano exprime sa joie? Ayoye! C'est malade ça!",
  "Qu'est-ce qu'un Mexicano dit quand quelque chose est bon? C'est capoté ben raide!",
];

export function getRandomJoke() {
  return tiGuyJokes[Math.floor(Math.random() * tiGuyJokes.length)];
}
