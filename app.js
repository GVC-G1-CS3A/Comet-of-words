window.onload = function () {
    // Definitions
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    var speed = 2; // Speed will vary depending on level

    // DICTIONARY WORDS
    const DICTIONARY = [
        'school',
        'college',
        'btc',
        'elon',
        'musk',
        'courses',
        'internet',
        'patience',
        'argentina',
        'motivation',
        'tech',
        'info',
        'send',
        'mate',
        'reactjs',
        'game',
        'brusca',
        'graphic',
        'copper',
        'boca',
        'lie',
        'case',
        'expand',
        'absence',
        'football',
        'native',
        'demon',
        'thread',
        'award',
        'tycoon',
        'riquelme',
        'still',
        'empirical',
        'doll',
        'java',
        'ackerman',
        'dinner',
        'register',
        'proof',
        'script',
        'wrist',
        'sulphur',
        'selection',
        'slam',
        'grandmother',
        'assertive',
        'eaux',
        'javascript',
        'admiration',
        'recognize',
        'roll',
        'bank',
        'reactor',
        'gradient',
        'ribbon',
        'slayer',
        'pleasant',
        'path',
        'draft',
        'polish',
        'art',
        'hook',
        'messi',
        'flow',
        'operational',
        'transaction',
        'physics',
        'rally',
        'fold',
        'housewife',
        'suspicion',
        'craft',
        'objective',
        'grass',
        'reckless',
        'manual',
        'test',
        'switch',
        'diegote',
        'silver',
        'take',
        'president',
        'constituency',
        'basis',
        'cluster',
        'psychology',
        'cat',
        'minimize',
        'hide',
        'chord',
        'brilliance',
        'official',
        'condition',
        'guideline',
        'apology',
        'general',
        'sock',
        'hunting',
        'kinship',
        'change',
        'departure',
        'mile',
        'ancestor',
        'diego',
        'cheat',
        'taxi',
        'tight',
        'moment',
        'dimension',
        'family',
        'vegan',
        'projection',
        'demonstration',
        'pony',
        'standard',
        'appendix',
        'reluctance',
        'gian',
        'davinci',
        'system',
        'analyst',
        'levi',
    ];
    
    // Word 1 
    var word1 = new Word(50, 25, 'violet', generateRandomWord(DICTIONARY));
    word1.x = 100;
    word1.y = 50;
    word1.context = context;

    // Speed of Word
    word1.vy = speed; // free fall

    animate();

    // GET RANDOM WORD FROM DICTIONARY
    function generateRandomWord(words) {
        return words[Math.floor(Math.random() * words.length)];
    }

    function animate() {

        reqAnimFrame = window.requestAnimationFrame;
        reqAnimFrame(animate);

        // Clear Canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Update

        // word1
        //word1.vy += gravity;
        word1.y += word1.vy;

        //Edge Collisions
        if (word1.y + word1.height > canvas.height || word1.x - word1.height < 0) {
            //word1.vy *= -1;
            console.log("Canvas collision");
        }

        // Draw
        word1.draw();

    }
};