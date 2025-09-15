export type Rule={need:string[],name:string,how:string}
export const RULES:Rule[]=[
  { need:['卵','牛乳','砂糖'], name:'プリン', how:'卵・牛乳・砂糖を混ぜ湯せんで蒸す' },
  { need:['トマト','パスタ'], name:'トマトパスタ', how:'にんにく＋トマトを煮てパスタと和える' },
  { need:['豆腐','味噌','ねぎ'], name:'豆腐とねぎの味噌汁', how:'だし→豆腐→味噌→ねぎ' },
  { need:['キャベツ','ベーコン'], name:'キャベツとベーコンのソテー', how:'ベーコン炒め→キャベツ→塩胡椒' },
  { need:['卵'], name:'卵焼き', how:'卵＋砂糖/塩で焼く' },
  { need:['豆腐'], name:'冷奴', how:'豆腐に醤油・ねぎ・生姜' }
]
