/**
 * Bible Word Database
 */

export interface BibleWord {
  word: string;
  definition: string;
  sentence: string;
  reference: string;
  category?: string;
}

export function getWordDifficulty(word: string): 1 | 2 | 3 {
  const normalizedLength = word.replace(/\s+/g, "").length;
  if (normalizedLength <= 4) return 1;
  if (normalizedLength <= 7) return 2;
  return 3;
}

export const BIBLE_WORDS: BibleWord[] = [
  { 
    word: "Aaron", 
    definition: "Moses' brother who helped him lead the people.", 
    sentence: "Aaron went with Moses to help him speak brave words.",
    reference: "Exodus 4",
    category: "Moses & Exodus"
  },
  { 
    word: "Abraham", 
    definition: "A man known for his great faith and being the father of many nations.", 
    sentence: "Abraham trusted God.",
    reference: "Genesis 12",
    category: "Genesis Beginnings"
  },
  { 
    word: "Adam", 
    definition: "The very first man made by God.", 
    sentence: "Adam lived in a beautiful garden that God made.",
    reference: "Genesis 2",
    category: "Genesis Beginnings"
  },
  { 
    word: "Angel", 
    definition: "God's special messengers from Heaven.", 
    sentence: "An angel told the shepherds that Jesus was born.",
    reference: "Psalm 91:11",
    category: "Christmas Story"
  },
  { 
    word: "Ark", 
    definition: "The big boat Noah built to keep his family and animals safe.", 
    sentence: "The ark floated safely on the water during the rain.",
    reference: "Genesis 6",
    category: "Noah's Story"
  },
  { 
    word: "Baptism", 
    definition: "Following Jesus by being washed in water to show we belong to Him.", 
    sentence: "Jesus was baptized in water.",
    reference: "Matthew 3" 
  },
  { 
    word: "Bible", 
    definition: "God's holy book filled with wonderful true stories.", 
    sentence: "I love reading the Bible to learn about Jesus.",
    reference: "Psalm 119:105" 
  },
  { 
    word: "Bread", 
    definition: "Jesus called himself the Bread of Life because he gives us what we need.", 
    sentence: "Jesus shared bread with His friends at the table.",
    reference: "John 6:35" 
  },
  { 
    word: "Christ", 
    definition: "The special name for Jesus, meaning 'The Chosen One'.", 
    sentence: "Jesus Christ is our King because He loves us.",
    reference: "Luke 2:11" 
  },
  { 
    word: "Creation", 
    definition: "Everything God made, including the stars, animals, and you!", 
    sentence: "God saw His beautiful creation and said it was good.",
    reference: "Genesis 1" 
  },
  { 
    word: "Cross", 
    definition: "The place where Jesus showed his great love for us.", 
    sentence: "The cross reminds us how much Jesus cares for us.",
    reference: "John 19",
    category: "Jesus' Life"
  },
  { 
    word: "Daniel", 
    definition: "A brave man who prayed to God even in a lions' den.", 
    sentence: "Daniel was not afraid because God was with him.",
    reference: "Daniel 6" 
  },
  { 
    word: "Disciple", 
    definition: "A friend and follower of Jesus who learns from him.", 
    sentence: "Each disciple followed Jesus and helped other people.",
    reference: "Matthew 4:19" 
  },
  { 
    word: "Dove", 
    definition: "A gentle bird that brought an olive branch back to Noah's Ark.", 
    sentence: "A white dove flew back to the boat with a green leaf.",
    reference: "Genesis 8",
    category: "Noah's Story"
  },
  { 
    word: "Eve", 
    definition: "The very first woman made by God.", 
    sentence: "Eve was the first mother in the whole world.",
    reference: "Genesis 2" 
  },
  { 
    word: "Faith", 
    definition: "Believing and trusting in God with all your heart.", 
    sentence: "Faith means we know God will always take care of us.",
    reference: "Hebrews 11:1" 
  },
  { 
    word: "Flood", 
    definition: "A big rain that covered the earth in Noah's time.", 
    sentence: "After the flood, God put a colorful rainbow in the sky.",
    reference: "Genesis 7",
    category: "Noah's Story"
  },
  { 
    word: "Forgive", 
    definition: "To let go of being mad and show love instead.", 
    sentence: "I can forgive my friends because God forgives me.",
    reference: "Ephesians 4:32" 
  },
  { 
    word: "God", 
    definition: "The loving Creator of everything and everyone.", 
    sentence: "God loves me and listens when I talk to Him.",
    reference: "Genesis 1:1" 
  },
  { 
    word: "Goliath", 
    definition: "A very tall giant who was defeated by David.", 
    sentence: "Even though Goliath was huge, David was brave.",
    reference: "1 Samuel 17",
    category: "Kings & Heroes"
  },
  { 
    word: "Grace", 
    definition: "God's wonderful gift of love that we don't have to earn.", 
    sentence: "God's grace makes our hearts happy and full of love.",
    reference: "Ephesians 2:8" 
  },
  { 
    word: "Heaven", 
    definition: "God's beautiful and happy home.", 
    sentence: "Heaven is a place where everything is bright and happy.",
    reference: "Revelation 21" 
  },
  { 
    word: "Holy", 
    definition: "Something that is very special and belongs to God.", 
    sentence: "The church is a holy place where we sing to God.",
    reference: "1 Peter 1:16" 
  },
  { 
    word: "Hope", 
    definition: "Trusting that God has good things planned for us.", 
    sentence: "I have hope because I know God is always good.",
    reference: "Jeremiah 29:11" 
  },
  { 
    word: "Israel", 
    definition: "The name given to Jacob and his big family.", 
    sentence: "The people of Israel traveled to a new home.",
    reference: "Genesis 32",
    category: "Genesis Beginnings"
  },
  { 
    word: "Jesus", 
    definition: "God's Son who loves us and is our best friend.", 
    sentence: "Jesus helps us to be kind and loving to everyone.",
    reference: "John 3:16",
    category: "Jesus' Life"
  },
  { 
    word: "Jonah", 
    definition: "A man who stayed inside a big fish for three days.", 
    sentence: "Jonah prayed and the big fish let him out on the beach.",
    reference: "Jonah 1" 
  },
  { 
    word: "Joseph", 
    definition: "A man who had a colorful coat and God helped him lead.", 
    sentence: "Joseph wore his bright coat and God was with him.",
    reference: "Genesis 37" 
  },
  { 
    word: "Joy", 
    definition: "The deep happiness that comes from knowing God loves you.", 
    sentence: "My heart is full of joy when I sing songs to God.",
    reference: "Romans 15:13" 
  },
  { 
    word: "King", 
    definition: "Jesus is the King of Kings who rules with love.", 
    sentence: "We celebrate Jesus because He is our loving King.",
    reference: "Revelation 19:16" 
  },
  { 
    word: "Kingdom", 
    definition: "The special place where God is the King.", 
    sentence: "God's kingdom is full of love, peace, and kindness.",
    reference: "Matthew 6:33" 
  },
  { 
    word: "Lamb", 
    definition: "A gentle animal used to describe how pure Jesus is.", 
    sentence: "The little lamb followed the shepherd to the field.",
    reference: "John 1:29" 
  },
  { 
    word: "Light", 
    definition: "Jesus said, 'I am the Light of the World'.", 
    sentence: "Jesus is like a bright light that shows us the way.",
    reference: "John 8:12" 
  },
  { 
    word: "Love", 
    definition: "God is love, and he wants us to love one another.", 
    sentence: "I show love when I share my toys with my sister.",
    reference: "1 John 4:8" 
  },
  { 
    word: "Mary", 
    definition: "The mother of Jesus who loved him very much.", 
    sentence: "Mary sang a happy song because God chose her.",
    reference: "Luke 1",
    category: "Christmas Story"
  },
  { 
    word: "Moses", 
    definition: "A leader who helped God's people cross the Red Sea.", 
    sentence: "Moses held up his staff and the water moved away.",
    reference: "Exodus 14",
    category: "Moses & Exodus"
  },
  { 
    word: "Manger", 
    definition: "A hay box where baby Jesus slept on the first Christmas.", 
    sentence: "Baby Jesus was warm and safe in the little manger.",
    reference: "Luke 2:7",
    category: "Christmas Story"
  },
  { 
    word: "Noah", 
    definition: "A man who built a huge boat called an Ark to save animals.", 
    sentence: "Noah built a big ark.",
    reference: "Genesis 6",
    category: "Noah's Story"
  },
  { 
    word: "Obey", 
    definition: "To follow God's instructions because we love him.", 
    sentence: "Children obey their parents because it makes God happy.",
    reference: "John 14:15" 
  },
  { 
    word: "Pray", 
    definition: "Talking and listening to God anytime, anywhere.", 
    sentence: "I pray to God when I wake up in the morning.",
    reference: "1 Thessalonians 5:17" 
  },
  { 
    word: "Peace", 
    definition: "A calm and happy feeling found when we trust God.", 
    sentence: "I feel peace because I know God is taking care of me.",
    reference: "Philippians 4:7" 
  },
  { 
    word: "Promised Land", 
    definition: "The beautiful home God promised to give his people.", 
    sentence: "The promised land was a place with yummy grapes.",
    reference: "Exodus 3" 
  },
  { 
    word: "Rainbow", 
    definition: "God's colorful promise in the sky after the flood.", 
    sentence: "The rainbow is God's sign that he will never flood the earth again.",
    reference: "Genesis 9",
    category: "Noah's Story"
  },
  { 
    word: "Resurrection", 
    definition: "When Jesus came back to life after three days.", 
    sentence: "We celebrate the resurrection on Easter Sunday.",
    reference: "Luke 24",
    category: "Jesus' Life"
  },
  { 
    word: "Savior", 
    definition: "Another name for Jesus because he saves us and loves us.", 
    sentence: "Jesus is my Savior because He loves me so much.",
    reference: "1 John 4:14" 
  },
  { 
    word: "Shepherd", 
    definition: "Someone who takes care of sheep, just like Jesus takes care of us.", 
    sentence: "The good shepherd finds his lost sheep and carries it home.",
    reference: "Psalm 23" 
  },
  { 
    word: "Sin", 
    definition: "Making choices that aren't what God wants for us.", 
    sentence: "When I make a bad choice, I can ask God for help.",
    reference: "Romans 3:23" 
  },
  { 
    word: "Temple", 
    definition: "A special building where people went to worship God.", 
    sentence: "People went to the temple to pray and sing.",
    reference: "Psalm 100" 
  },
  { 
    word: "Thankful", 
    definition: "Having a happy heart and saying 'thank you' to God.", 
    sentence: "I am thankful for my family and for my toys.",
    reference: "Psalm 107:1" 
  },
  { 
    word: "Wise Men", 
    definition: "Men who followed a star to find baby Jesus.", 
    sentence: "The wise men brought special gifts to baby Jesus.",
    reference: "Matthew 2",
    category: "Christmas Story"
  },
  { 
    word: "Worship", 
    definition: "Showing God how much we love him through song and prayer.", 
    sentence: "We worship God when we sing happy songs about Him.",
    reference: "John 4:24" 
  },
  { 
    word: "Zacchaeus", 
    definition: "A short man who climbed a tree to see Jesus.", 
    sentence: "Zacchaeus climbed the tree and Jesus came to his house.",
    reference: "Luke 19",
    category: "Jesus' Life"
  },
];
