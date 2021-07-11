export interface Station {
  id: string;
  line_id: 'N' | 'T' | 'H';
  line_name: '南北線' | '東西線' | '東豊線';
  offical_name: string;
  common_names: string[];
}

export const stations: Station[] = [
  {
    id: 'N01',
    line_id: 'N',
    line_name: '南北線',
    offical_name: '麻生駅',
    common_names: ['麻生', 'あさぶ', 'あざぶ']
  },
  {
    id: 'N02',
    line_id: 'N',
    line_name: '南北線',
    offical_name: '北34条駅',
    common_names: ['北34条', '北三十四条', 'きた34じょう', 'きたさんじゅうよじょう', 'きたさんじゅうよんじょう', '北34', '北三十四', 'きた34', 'きたさんじゅうよん']
  },
  {
    id: 'N03',
    line_id: 'N',
    line_name: '南北線',
    offical_name: '北24条駅',
    common_names: ['北24条', '北二十四条', 'きた24じょう', 'きたにじゅうよじょう', 'きたにじゅうよんじょう', '北24', '北二十四', 'きた24', 'きたにじゅうよん', 'にーよん']
  },
  {
    id: 'N04',
    line_id: 'N',
    line_name: '南北線',
    offical_name: '北18条駅',
    common_names: ['北18条', '北十八条', 'きた18じょう', 'きたじゅうはちじょう', '北18', '北十八', 'きた18', 'きたじゅうはち']
  },
  {
    id: 'N05',
    line_id: 'N',
    line_name: '南北線',
    offical_name: '北12条駅',
    common_names: ['北12条', '北十二条', 'きた12じょう', 'きたじゅうにじょう', '北12', '北十二', 'きた12', 'きたじゅうに']
  },
  {
    id: 'N06',
    line_id: 'N',
    line_name: '南北線',
    offical_name: 'さっぽろ駅',
    common_names: ['さっぽろ', '札幌', '札駅', 'さつ']
  },
  {
    id: 'N07',
    line_id: 'N',
    line_name: '南北線',
    offical_name: '大通駅',
    common_names: ['大通', '大通り', 'おおどおり']
  },
  {
    id: 'N08',
    line_id: 'N',
    line_name: '南北線',
    offical_name: 'すすきの駅',
    common_names: ['薄野', 'すすきの']
  },
  {
    id: 'N09',
    line_id: 'N',
    line_name: '南北線',
    offical_name: '中島公園駅',
    common_names: ['中島公園', 'なかじまこうえん']
  },
  {
    id: 'N10',
    line_id: 'N',
    line_name: '南北線',
    offical_name: '幌平橋駅',
    common_names: ['幌平橋', 'ほろひらばし', '幌平', 'ほろひら']
  },
  {
    id: 'N11',
    line_id: 'N',
    line_name: '南北線',
    offical_name: '中の島駅',
    common_names: ['中の島', 'なかのしま']
  },
  {
    id: 'N12',
    line_id: 'N',
    line_name: '南北線',
    offical_name: '平岸駅',
    common_names: ['平岸', 'ひらぎし']
  },
  {
    id: 'N13',
    line_id: 'N',
    line_name: '南北線',
    offical_name: '南平岸駅',
    common_names: ['南平岸', 'みなみひらぎし', '南平', 'なんぴら']
  },
  {
    id: 'N14',
    line_id: 'N',
    line_name: '南北線',
    offical_name: '澄川駅',
    common_names: ['澄川', 'すみかわ']
  },
  {
    id: 'N15',
    line_id: 'N',
    line_name: '南北線',
    offical_name: '自衛隊前駅',
    common_names: ['自衛隊前', 'じえいたいまえ']
  },
  {
    id: 'N16',
    line_id: 'N',
    line_name: '南北線',
    offical_name: '真駒内駅',
    common_names: ['真駒内', 'まこまない']
  },
  {
    id: 'T01',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '宮の沢駅',
    common_names: ['宮の沢', 'みやのさわ']
  },
  {
    id: 'T02',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '発寒南駅',
    common_names: ['発寒南', 'はっさむみなみ']
  },
  {
    id: 'T03',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '琴似駅',
    common_names: ['琴似', 'ことに']
  },
  {
    id: 'T04',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '二十四軒駅',
    common_names: ['二十四軒', 'にじゅうよんけん', '24軒', '24けん']
  },
  {
    id: 'T05',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '西28丁目駅',
    common_names: ['西28丁目', '西二十八丁目', 'にしにじゅうはっちょうめ', 'にし28ちょうめ', '西28', '西二十八', 'にし28', 'にしにじゅうはち']
  },
  {
    id: 'T06',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '円山公園駅',
    common_names: ['円山公園', 'まるやまこうえん', '円山', 'まるやま']
  },
  {
    id: 'T07',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '西18丁目駅',
    common_names: ['西18丁目', '西十八丁目', 'にしじゅうはっちょうめ', 'にし18ちょうめ', '西18', '西十八', 'にし18', 'にしじゅうはち']
  },
  {
    id: 'T08',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '西11丁目駅',
    common_names: ['西11丁目', '西十一丁目', 'にしじゅういっちょうめ', 'にし11ちょうめ', '西11', '西十一', 'にし11', 'にしじゅういち']
  },
  {
    id: 'T09',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '大通駅',
    common_names: ['大通', '大通り', 'おおどおり']
  },
  {
    id: 'T10',
    line_id: 'T',
    line_name: '東西線',
    offical_name: 'バスセンター前駅',
    common_names: ['ばすせんたー前', 'ばすせんたーまえ', 'ばすせんたー']
  },
  {
    id: 'T11',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '菊水駅',
    common_names: ['菊水', 'きくすい']
  },
  {
    id: 'T12',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '東札幌駅',
    common_names: ['東札幌', 'ひがしさっぽろ']
  },
  {
    id: 'T13',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '白石駅',
    common_names: ['白石', 'しろいし']
  },
  {
    id: 'T14',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '南郷7丁目駅',
    common_names: ['南郷7丁目', '南郷七丁目', 'なんごう7ちょうめ', 'なんごうななちょうめ', '南郷7', '南郷七', 'なんごうなな', '南7', '南七', 'なんなな']
  },
  {
    id: 'T15',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '南郷13丁目駅',
    common_names: ['南郷13丁目', '南郷十三丁目', 'なんごう13ちょうめ', 'なんごうじゅうさんちょうめ', '南郷13', '南郷十三', 'なんごうじゅうさん']
  },
  {
    id: 'T16',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '南郷18丁目駅',
    common_names: ['南郷18丁目', '南郷十八丁目', 'なんごう18ちょうめ', 'なんごうじゅうはっちょうめ', '南郷18', '南郷十八', 'なんごうじゅうはち']
  },
  {
    id: 'T17',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '大谷地駅',
    common_names: ['大谷地', 'おおやち']
  },
  {
    id: 'T18',
    line_id: 'T',
    line_name: '東西線',
    offical_name: 'ひばりが丘駅',
    common_names: ['ひばりが丘', 'ひばりヶ丘', 'ひばりがおか']
  },
  {
    id: 'T19',
    line_id: 'T',
    line_name: '東西線',
    offical_name: '新さっぽろ駅',
    common_names: ['新さっぽろ', '新札幌', 'しんさっぽろ', '新札', 'しんさつ']
  },
  {
    id: 'H01',
    line_id: 'H',
    line_name: '東豊線',
    offical_name: '栄町駅',
    common_names: ['栄町', 'さかえまち']
  },
  {
    id: 'H02',
    line_id: 'H',
    line_name: '東豊線',
    offical_name: '新道東駅',
    common_names: ['新道東', 'しんどうひがし']
  },
  {
    id: 'H03',
    line_id: 'H',
    line_name: '東豊線',
    offical_name: '元町駅',
    common_names: ['元町', 'もとまち']
  },
  {
    id: 'H04',
    line_id: 'H',
    line_name: '東豊線',
    offical_name: '環状通東駅',
    common_names: ['環状通東', 'かんじょうどおりひがし', '環状通', 'かんじょうどおり']
  },
  {
    id: 'H05',
    line_id: 'H',
    line_name: '東豊線',
    offical_name: '東区役所前駅',
    common_names: ['東区役所前', 'ひがしくやくしょまえ', '東区役所', 'ひがしくやくしょ']
  },
  {
    id: 'H06',
    line_id: 'H',
    line_name: '東豊線',
    offical_name: '北13条東駅',
    common_names: ['北13条東', '北十三条東', 'きた13じょうひがし', 'きたじゅうさんじょうひがし', '北13条', '北十三条', 'きた13じょう', 'きたじゅうさんじょう']
  },
  {
    id: 'H07',
    line_id: 'H',
    line_name: '東豊線',
    offical_name: 'さっぽろ駅',
    common_names: ['札幌', 'さっぽろ', '札駅', 'さつ']
  },
  {
    id: 'H08',
    line_id: 'H',
    line_name: '東豊線',
    offical_name: '大通駅',
    common_names: ['大通', '大通り', 'おおどおり']
  },
  {
    id: 'H09',
    line_id: 'H',
    line_name: '東豊線',
    offical_name: '豊水すすきの駅',
    common_names: ['豊水すすきの', '豊水薄野', 'ほうすいすすきの']
  },
  {
    id: 'H10',
    line_id: 'H',
    line_name: '東豊線',
    offical_name: '学園前駅',
    common_names: ['学園前', 'がくえんまえ']
  },
  {
    id: 'H11',
    line_id: 'H',
    line_name: '東豊線',
    offical_name: '豊平公園駅',
    common_names: ['豊平公園', 'とよひらこうえん']
  },
  {
    id: 'H12',
    line_id: 'H',
    line_name: '東豊線',
    offical_name: '美園駅',
    common_names: ['美園', 'みその']
  },
  {
    id: 'H13',
    line_id: 'H',
    line_name: '東豊線',
    offical_name: '月寒中央駅',
    common_names: ['月寒中央', 'つきさむちゅうおう']
  },
  {
    id: 'H14',
    line_id: 'H',
    line_name: '東豊線',
    offical_name: '福住駅',
    common_names: ['福住', 'ふくずみ']
  }
];
