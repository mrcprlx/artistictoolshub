const forms = [
    {
        name: "sonnet",
        description: "A 14-line poem with a specific rhyme scheme, often iambic pentameter.",
        example: "Shakespeare’s 'Shall I compare thee to a summer’s day?'",
        lineCount: 14,
        rhymeScheme: "ABABCDCDEFEFGG",
        syllablesPerLine: 10,
        meter: "iambic pentameter",
        specialRules: null
    },
    {
        name: "haiku",
        description: "A 3-line Japanese form with a 5-7-5 syllable count, often capturing a nature moment.",
        example: "An old silent pond / A frog jumps into the pond— / Splash! Silence again (Basho).",
        lineCount: 3,
        rhymeScheme: null,
        syllablesPerLine: [5, 7, 5],
        meter: null,
        specialRules: null
    },
    {
        name: "limerick",
        description: "A 5-line humorous poem with an AABBA rhyme scheme.",
        example: "There was an old man from Peru / Whose limericks would end line two.",
        lineCount: 5,
        rhymeScheme: "AABBA",
        syllablesPerLine: [8, 8, 5, 5, 8],
        meter: "anapestic",
        specialRules: null
    },
    {
        name: "free verse",
        description: "A poem with no set meter or rhyme scheme, focusing on natural speech rhythms.",
        example: "Walt Whitman’s 'Song of Myself'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "No structural requirements; analysis limited to line count."
    },
    {
        name: "villanelle",
        description: "A 19-line poem with five tercets and a quatrain, using two refrains and an ABA rhyme scheme.",
        example: "Dylan Thomas’ 'Do not go gentle into that good night'.",
        lineCount: 19,
        rhymeScheme: "ABA ABA ABA ABA ABA ABAA",
        syllablesPerLine: 10,
        meter: "iambic pentameter",
        specialRules: {
            refrains: [
                { line: 1, repeats: [6, 12, 18] },
                { line: 3, repeats: [9, 15, 19] }
            ]
        }
    },
    {
        name: "sestina",
        description: "A 39-line poem with six sestets and a tercet, using a complex pattern of end-word repetition.",
        example: "Elizabeth Bishop’s 'Sestina'.",
        lineCount: 39,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: {
            endWordPattern: [
                [1, 2, 3, 4, 5, 6],
                [6, 1, 5, 2, 4, 3],
                [3, 6, 4, 1, 2, 5],
                [5, 3, 2, 6, 1, 4],
                [4, 5, 1, 3, 6, 2],
                [2, 4, 6, 5, 3, 1]
            ],
            tercetEndWords: [1, 2, 3, 4, 5, 6]
        }
    },
    {
        name: "ode",
        description: "A lyrical poem expressing emotion, often addressing a person or thing.",
        example: "Keats’ 'Ode to a Nightingale'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: "iambic pentameter",
        specialRules: "No strict structure; often uses stanzas."
    },
    {
        name: "elegy",
        description: "A mournful poem, often lamenting the dead.",
        example: "Whitman’s 'O Captain! My Captain!'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "No strict structure; tone-based."
    },
    {
        name: "ballad",
        description: "A narrative poem, often with a simple meter and rhyme, telling a story.",
        example: "Coleridge’s 'The Rime of the Ancient Mariner'.",
        lineCount: null,
        rhymeScheme: "ABCB",
        syllablesPerLine: [8, 6, 8, 6],
        meter: "iambic",
        specialRules: "Typically in quatrains."
    },
    {
        name: "blank verse",
        description: "Unrhymed iambic pentameter, often used in epic poetry.",
        example: "Milton’s 'Paradise Lost'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: 10,
        meter: "iambic pentameter",
        specialRules: null
    },
    {
        name: "ghazal",
        description: "A Persian form with couplets, a refrain, and a rhyme scheme, often about love or loss.",
        example: "Agha Shahid Ali’s 'Even the Rain'.",
        lineCount: null,
        rhymeScheme: "AA BA CA DA",
        syllablesPerLine: null,
        meter: null,
        specialRules: {
            refrains: [{ line: 2, repeats: [4, 6, 8, 10] }]
        }
    },
    {
        name: "tanka",
        description: "A 5-line Japanese form with a 5-7-5-7-7 syllable count, often extending a haiku.",
        example: "The moon on the lake / Shimmers like a silver fish / Slipping through my hands / In the night’s embrace I dream / Of a love that never ends.",
        lineCount: 5,
        rhymeScheme: null,
        syllablesPerLine: [5, 7, 5, 7, 7],
        meter: null,
        specialRules: null
    },
    {
        name: "pantoum",
        description: "A Malay form with repeating lines in a pattern across quatrains.",
        example: "Baudelaire’s 'Harmonie du soir'.",
        lineCount: null,
        rhymeScheme: "ABAB BCBC CDCD",
        syllablesPerLine: null,
        meter: null,
        specialRules: {
            refrains: [
                { line: 2, repeats: [6, 10, 14] },
                { line: 4, repeats: [8, 12, 16] }
            ]
        }
    },
    {
        name: "terza rima",
        description: "A three-line stanza form with an interlocking rhyme scheme (ABA BCB CDC).",
        example: "Dante’s 'Divine Comedy'.",
        lineCount: null,
        rhymeScheme: "ABA BCB CDC",
        syllablesPerLine: 11,
        meter: "iambic pentameter",
        specialRules: null
    },
    {
        name: "rondeau",
        description: "A French form with 15 lines, two rhymes, and a refrain.",
        example: "John McCrae’s 'In Flanders Fields'.",
        lineCount: 15,
        rhymeScheme: "AABBA AABR AABBAR",
        syllablesPerLine: null,
        meter: null,
        specialRules: {
            refrains: [{ line: 1, repeats: [9, 15] }]
        }
    },
    {
        name: "triolet",
        description: "An 8-line French form with two rhymes and two refrains (ABaAabAB).",
        example: "Thomas Hardy’s 'The Convergence of the Twain'.",
        lineCount: 8,
        rhymeScheme: "ABaAabAB",
        syllablesPerLine: null,
        meter: null,
        specialRules: {
            refrains: [
                { line: 1, repeats: [4, 7] },
                { line: 2, repeats: [8] }
            ]
        }
    },
    {
        name: "clerihew",
        description: "A humorous 4-line poem with an AABB rhyme scheme about a person.",
        example: "Edmund Clerihew Bentley’s 'Sir Christopher Wren'.",
        lineCount: 4,
        rhymeScheme: "AABB",
        syllablesPerLine: null,
        meter: null,
        specialRules: null
    },
    {
        name: "kyrielle",
        description: "A French form with 8-syllable lines in couplets, ending with a refrain.",
        example: "A medieval hymn: Lord, have mercy on us all.",
        lineCount: null,
        rhymeScheme: "AABB CCBB",
        syllablesPerLine: 8,
        meter: null,
        specialRules: {
            refrains: [{ line: 2, repeats: [4, 6, 8] }]
        }
    },
    {
        name: "fib",
        description: "A 6-line poem with syllable counts based on the Fibonacci sequence (1-1-2-3-5-8).",
        example: "Snow / Falls / Gentle / Flakes drift / Swirling down / Blanketing the earth in white.",
        lineCount: 6,
        rhymeScheme: null,
        syllablesPerLine: [1, 1, 2, 3, 5, 8],
        meter: null,
        specialRules: null
    },
    {
        name: "blackout poetry",
        description: "A form where words are redacted from a text to create a new poem.",
        example: "Created from a newspaper article: 'Whispers of dawn / Break through the silence'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Cannot be analyzed programmatically due to redaction."
    },
    {
        name: "golden shovel",
        description: "A form where each word of a line from another poem becomes the last word of each line in the new poem.",
        example: "Terrance Hayes’ 'The Golden Shovel' after Gwendolyn Brooks.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Requires a source line; end words must match source."
    },
    {
        name: "acrostic",
        description: "A poem where the first letter of each line spells out a word.",
        example: "Using 'BEAR': Busting into my trash can / Eating everything he can find / A bear is living / Right in my backyard.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "First letters spell a word."
    },
    {
        name: "cinquain",
        description: "A 5-line poem with a 2-4-6-8-2 syllable count, often describing a subject.",
        example: "Adelaide Crapsey’s 'November Night'.",
        lineCount: 5,
        rhymeScheme: null,
        syllablesPerLine: [2, 4, 6, 8, 2],
        meter: null,
        specialRules: null
    },
    {
        name: "couplet",
        description: "A two-line poem or stanza with a consistent rhyme scheme.",
        example: "The rose blooms red / Upon the bed.",
        lineCount: 2,
        rhymeScheme: "AA",
        syllablesPerLine: null,
        meter: null,
        specialRules: null
    },
    {
        name: "quatrain",
        description: "A four-line stanza with various possible rhyme schemes (e.g., ABAB, AABB).",
        example: "The cat sits still / Upon the hill / Watching the sky / As clouds drift by.",
        lineCount: 4,
        rhymeScheme: "ABAB",
        syllablesPerLine: null,
        meter: null,
        specialRules: null
    },
    {
        name: "renga",
        description: "A Japanese collaborative form with linked tanka stanzas.",
        example: "A traditional renga alternates between poets, building a nature narrative.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: [5, 7, 5, 7, 7],
        meter: null,
        specialRules: "Alternates 5-7-5 and 7-7 syllable stanzas."
    },
    {
        name: "rubai",
        description: "A Persian quatrain with an AABA rhyme scheme, often philosophical.",
        example: "Omar Khayyam’s 'Rubaiyat'.",
        lineCount: 4,
        rhymeScheme: "AABA",
        syllablesPerLine: null,
        meter: null,
        specialRules: null
    },
    {
        name: "lai",
        description: "A French form with 9 lines in three tercets, using two rhymes.",
        example: "A medieval lai: The knight rode forth / With love in his heart / To seek his north.",
        lineCount: 9,
        rhymeScheme: "AAB AAB AAB",
        syllablesPerLine: [5, 5, 2, 5, 5, 2, 5, 5, 2],
        meter: null,
        specialRules: null
    },
    {
        name: "virelai",
        description: "A French form with three-line stanzas and a complex rhyme scheme.",
        example: "A medieval virelai about courtly love.",
        lineCount: null,
        rhymeScheme: "AABA AABA",
        syllablesPerLine: null,
        meter: null,
        specialRules: null
    },
    {
        name: "sijo",
        description: "A Korean form with three lines of 14–16 syllables each, often reflective.",
        example: "A traditional sijo: The stream flows gently / Whispering secrets to the stones / I sit and listen.",
        lineCount: 3,
        rhymeScheme: null,
        syllablesPerLine: [15, 15, 15],
        meter: null,
        specialRules: null
    },
    {
        name: "epigram",
        description: "A short, witty poem or statement, often satirical.",
        example: "Alexander Pope’s 'I am his Highness’ dog at Kew'.",
        lineCount: 2,
        rhymeScheme: "AA",
        syllablesPerLine: null,
        meter: null,
        specialRules: null
    },
    {
        name: "pastoral",
        description: "A poem idealizing rural life or shepherds.",
        example: "Marlowe’s 'The Passionate Shepherd to His Love'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "No strict structure; theme-based."
    },
    {
        name: "aubade",
        description: "A poem about dawn or morning, often involving lovers parting.",
        example: "Donne’s 'The Sun Rising'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "No strict structure; theme-based."
    },
    {
        name: "palinode",
        description: "A poem that retracts a previous statement or poem.",
        example: "Chaucer’s retraction at the end of 'The Canterbury Tales'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "No strict structure; theme-based."
    },
    {
        name: "epithalamion",
        description: "A poem written to celebrate a marriage.",
        example: "Spenser’s 'Epithalamion'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: "iambic",
        specialRules: "No strict structure; theme-based."
    },
    {
        name: "found poetry",
        description: "A poem created by taking words from other texts and rearranging them.",
        example: "Using a page from a novel: 'Shadows dance / In the flickering light'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Cannot be analyzed programmatically due to source variability."
    },
    {
        name: "concrete poetry",
        description: "A poem where the visual arrangement of words reflects the subject.",
        example: "A poem about a tree shaped like a tree on the page.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Cannot be analyzed programmatically due to visual form."
    },
    {
        name: "diamante",
        description: "A 7-line poem in a diamond shape, comparing two subjects.",
        example: "Cat / Soft, sleek / Purring, stalking, napping / Feline, predator, canine, companion / Barking, running, fetching / Loud, loyal / Dog.",
        lineCount: 7,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Lines 1 and 7 are nouns; lines 2 and 6 are adjectives; lines 3 and 5 are verbs; line 4 has four nouns."
    },
    {
        name: "nonet",
        description: "A 9-line poem with a syllable count decreasing from 9 to 1.",
        example: "The sunset paints the sky with fiery hues / Colors blend into a warm embrace / A fleeting moment of pure peace / The light begins to fade away / Stars peek through the twilight / Night wraps the world in calm / A whisper of breeze / The moon rises / Still.",
        lineCount: 9,
        rhymeScheme: null,
        syllablesPerLine: [9, 8, 7, 6, 5, 4, 3, 2, 1],
        meter: null,
        specialRules: null
    },
    {
        name: "tetractys",
        description: "A 5-line poem with syllable counts 1-2-3-4-10.",
        example: "Love / Whispers / In the night / Softly calling / A tender heart answers with endless delight.",
        lineCount: 5,
        rhymeScheme: null,
        syllablesPerLine: [1, 2, 3, 4, 10],
        meter: null,
        specialRules: null
    },
    {
        name: "monostich",
        description: "A one-line poem, often concise and impactful.",
        example: "A single tear falls silently.",
        lineCount: 1,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: null
    },
    {
        name: "ottava rima",
        description: "An 8-line stanza with an ABABABCC rhyme scheme.",
        example: "Byron’s 'Don Juan'.",
        lineCount: 8,
        rhymeScheme: "ABABABCC",
        syllablesPerLine: 11,
        meter: "iambic pentameter",
        specialRules: null
    },
    {
        name: "spenserian stanza",
        description: "A 9-line stanza with an ABABBCBCC rhyme scheme, often in iambic pentameter.",
        example: "Spenser’s 'The Faerie Queene'.",
        lineCount: 9,
        rhymeScheme: "ABABBCBCC",
        syllablesPerLine: [10, 10, 10, 10, 10, 10, 10, 10, 12],
        meter: "iambic pentameter",
        specialRules: null
    },
    {
        name: "ballade",
        description: "A French form with three 8-line stanzas and a 4-line envoi, using an ABABBCBC rhyme scheme.",
        example: "Chaucer’s 'Ballade of Good Counsel'.",
        lineCount: 28,
        rhymeScheme: "ABABBCBC ABABBCBC ABABBCBC BCBC",
        syllablesPerLine: 10,
        meter: "iambic pentameter",
        specialRules: {
            refrains: [{ line: 8, repeats: [16, 24, 28] }]
        }
    },
    {
        name: "chain verse",
        description: "A form where the last word or phrase of one line begins the next.",
        example: "The sky turns dark / Dark clouds gather / Gather rain to fall / Fall gently on the earth.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Last word of each line starts the next."
    },
    {
        name: "echo verse",
        description: "A form where the last syllable or word of each line is repeated as an echo.",
        example: "I call to the hills—hills / They answer with thrills—thrills.",
        lineCount: null,
        rhymeScheme: "AA BB",
        syllablesPerLine: null,
        meter: null,
        specialRules: "Last syllable or word echoes."
    },
    {
        name: "glosa",
        description: "A form that takes a quatrain from another poem and expands on it in four 10-line stanzas.",
        example: "P.K. Page’s 'Glosa' after Rilke.",
        lineCount: 40,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Each stanza ends with a line from the source quatrain."
    },
    {
        name: "bref double",
        description: "A 14-line French form with three rhymes used in varying patterns.",
        example: "A medieval bref double about a knight’s quest.",
        lineCount: 14,
        rhymeScheme: "ABAB CDDC EFFE GG",
        syllablesPerLine: null,
        meter: null,
        specialRules: null
    },
    {
        name: "rondelet",
        description: "A 7-line French form with a refrain and an ABaAabA rhyme scheme.",
        example: "A rondelet: The moon does glow / In night’s embrace / Its silver show / The moon does glow / Lights up the snow / In a soft grace / The moon does glow.",
        lineCount: 7,
        rhymeScheme: "ABaAabA",
        syllablesPerLine: [4, 8, 8, 4, 8, 8, 4],
        meter: null,
        specialRules: {
            refrains: [
                { line: 1, repeats: [4, 7] }
            ]
        }
    },
    {
        name: "troubadour poetry",
        description: "Medieval lyric poetry by troubadours, often about courtly love.",
        example: "A canso by Bernart de Ventadorn.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "No strict structure; theme-based."
    },
    {
        name: "canzone",
        description: "An Italian form with stanzas of equal length, often about love.",
        example: "Petrarch’s 'Canzoniere'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "No strict structure; stanza-based."
    },
    {
        name: "carpe diem",
        description: "A poem urging to seize the day, often about love or mortality.",
        example: "Herrick’s 'To the Virgins, to Make Much of Time'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "No strict structure; theme-based."
    },
    {
        name: "cento",
        description: "A poem made entirely of lines from other poems.",
        example: "A cento using lines from Dickinson and Whitman.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Cannot be analyzed programmatically due to source variability."
    },
    {
        name: "chance operations",
        description: "A form using random methods to determine structure or content.",
        example: "John Cage’s experimental poetry.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Cannot be analyzed programmatically due to randomness."
    },
    {
        name: "cut-up technique",
        description: "A form where text is cut and rearranged to create a new poem.",
        example: "William S. Burroughs’ cut-up poetry.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Cannot be analyzed programmatically due to randomness."
    },
    {
        name: "double dactyl",
        description: "A humorous 8-line poem with a specific dactylic meter.",
        example: "Higgledy piggledy / Emily Dickinson / Wrote of the soul with such / Fierce intensity.",
        lineCount: 8,
        rhymeScheme: "AABBCCDD",
        syllablesPerLine: [6, 6, 6, 6, 6, 6, 6, 6],
        meter: "dactylic",
        specialRules: "Lines 2 and 6 are proper names; line 6 is a single word."
    },
    {
        name: "etheree",
        description: "A 10-line poem with syllable counts increasing from 1 to 10.",
        example: "Snow / Falls down / In soft flakes / Covering the ground / A blanket of pure white / Shimmering in the moonlight / Cold air bites at uncovered skin / A quiet world wrapped in winter’s charm / The silence sings a song of peace and calm / Nature’s beauty unfolds in this frozen scene.",
        lineCount: 10,
        rhymeScheme: null,
        syllablesPerLine: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        meter: null,
        specialRules: null
    },
    {
        name: "flarf",
        description: "A modern form using internet search results to create absurd poetry.",
        example: "A poem using random Google search snippets.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Cannot be analyzed programmatically due to randomness."
    },
    {
        name: "haibun",
        description: "A Japanese form combining prose and haiku, often about travel.",
        example: "Basho’s 'The Narrow Road to the Deep North'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Includes prose and at least one haiku (5-7-5 syllables)."
    },
    {
        name: "list poem",
        description: "A poem structured as a list, often thematic.",
        example: "A list of things found in a poet’s desk: A quill, a crumpled note, a dream.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "No strict structure; list-based."
    },
    {
        name: "luc bat",
        description: "A Vietnamese form with alternating 6- and 8-syllable lines, rhyming at specific points.",
        example: "A traditional luc bat about a river’s journey.",
        lineCount: null,
        rhymeScheme: "AB BC CD DE",
        syllablesPerLine: [6, 8, 6, 8],
        meter: null,
        specialRules: "Rhymes link lines in a chain."
    },
    {
        name: "mirror poem",
        description: "A poem where the second half mirrors the first in structure or theme.",
        example: "The first half describes dawn, the second dusk.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Second half mirrors first half."
    },
    {
        name: "palindrome poem",
        description: "A poem that reads the same forwards and backwards at the word or line level.",
        example: "A short palindrome poem: Rise / Eyes / See / Eyes / Rise.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Reads the same forwards and backwards."
    },
    {
        name: "paradelle",
        description: "A modern, complex form with repeating lines in a specific pattern.",
        example: "Billy Collins’ 'Paradelle for Susan'.",
        lineCount: 24,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: {
            refrains: [
                { line: 1, repeats: [5, 11, 17, 23] },
                { line: 2, repeats: [6, 12, 18, 24] }
            ]
        }
    },
    {
        name: "prose poetry",
        description: "A poem written in prose form but with poetic qualities.",
        example: "Baudelaire’s 'Be Drunk'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "No strict structure; prose-based."
    },
    {
        name: "riddle poem",
        description: "A poem that describes something indirectly, inviting the reader to guess the subject.",
        example: "I speak without a mouth—wind.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "No strict structure; riddle-based."
    },
    {
        name: "sapphic stanza",
        description: "A four-line stanza with a specific meter, used by Sappho.",
        example: "A modern sapphic: The moon’s gentle glow / Lights the path below / Stars whisper secrets / In the night’s embrace.",
        lineCount: 4,
        rhymeScheme: null,
        syllablesPerLine: [11, 11, 11, 5],
        meter: "sapphic",
        specialRules: null
    },
    {
        name: "skeltonic verse",
        description: "A form with short, rhyming lines and a playful tone.",
        example: "John Skelton’s 'Speke Parott'.",
        lineCount: null,
        rhymeScheme: "AA BB CC",
        syllablesPerLine: [4, 4, 4],
        meter: null,
        specialRules: null
    },
    {
        name: "tongue twister poem",
        description: "A poem using alliteration and difficult sounds for playful effect.",
        example: "Silly Sally swiftly shooed seven silly sheep.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "Heavy alliteration required."
    },
    {
        name: "vers libre",
        description: "Another term for free verse, emphasizing freedom from traditional forms.",
        example: "T.S. Eliot’s 'The Love Song of J. Alfred Prufrock'.",
        lineCount: null,
        rhymeScheme: null,
        syllablesPerLine: null,
        meter: null,
        specialRules: "No structural requirements; analysis limited to line count."
    },
    {
        name: "word sonnet",
        description: "A 14-line poem with one word per line.",
        example: "Love / Burns / Bright / Yet / Fades / In / Time / We / Seek / Its / Flame / To / Hold / Forever.",
        lineCount: 14,
        rhymeScheme: null,
        syllablesPerLine: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        meter: null,
        specialRules: "One word per line."
    }
];

// Ensure the haiku form allows flexibility for Line 2
forms.find(form => form.name === "haiku").syllablesPerLine = [5, { min: 4, max: 7 }, 5];

let dictionary = [];
let dictionaryLoaded = false;

// Load cmudict.json with retries
async function loadDictionary() {
    const cached = localStorage.getItem('cmudict');
    if (cached) {
        try {
            dictionary = JSON.parse(cached);
            dictionaryLoaded = true;
            console.log(`Loaded cmudict.json from localStorage with ${dictionary.length} entries`);
            return;
        } catch (e) {
            console.error('Failed to parse cached cmudict:', e);
        }
    }

    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch('./cmudict.json');
            if (!response.ok) {
                throw new Error(`Failed to load cmudict.json: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            dictionary = data;
            dictionaryLoaded = true;
            console.log(`Loaded cmudict.json with ${dictionary.length} entries (attempt ${attempt})`);
            localStorage.setItem('cmudict', JSON.stringify(data));
            return;
        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);
            if (attempt === maxRetries) {
                dictionaryLoaded = false;
                console.error('All fetch attempts failed; using syllable library fallback');
                document.getElementById('analyzer-results').innerHTML = '<p class="error">Error: Could not load syllable dictionary. Using syllable library fallback.</p>';
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const formSelect = document.getElementById('form-select');
    forms.forEach(form => {
        const option = new Option(form.name, form.name);
        option.textContent = form.name.charAt(0).toUpperCase() + form.name.slice(1);
        formSelect.appendChild(option);
    });

    loadDictionary();
});

async function analyzePoem() {
    const poemInput = document.getElementById('poem-input').value.trim();
    const formSelect = document.getElementById('form-select').value;
    const resultsDiv = document.getElementById('analyzer-results');
    resultsDiv.innerHTML = '<p class="loading">Analyzing...</p>';

    if (!poemInput) {
        resultsDiv.innerHTML = '<p>Please enter a poem to analyze.</p>';
        return;
    }

    // Wait for dictionary to load (up to 10 seconds)
    if (!dictionaryLoaded) {
        for (let i = 0; i < 20; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (dictionaryLoaded) break;
        }
        if (!dictionaryLoaded) {
            resultsDiv.innerHTML = '<p class="warning">Warning: Syllable dictionary not loaded. Using syllable library fallback.</p>';
        }
    }

    const selectedForm = forms.find(form => form.name === formSelect);
    if (!selectedForm) {
        resultsDiv.innerHTML = '<p>Error: Form not found. Please try again.</p>';
        return;
    }

    const lines = poemInput.split('\n').filter(line => line.trim());
    const analysis = {
        lineCount: { valid: true, message: '' },
        syllables: { valid: true, message: '' },
        rhyme: { valid: true, message: '' },
        meter: { valid: true, message: '' },
        special: { valid: true, message: '' }
    };

    // Line count validation
    if (selectedForm.lineCount && lines.length !== selectedForm.lineCount) {
        analysis.lineCount.valid = false;
        analysis.lineCount.message = `Expected ${selectedForm.lineCount} lines, but found ${lines.length}.`;
    }

    // Syllable counting
    try {
        const syllableCounts = lines.map(line => countSyllables(line));
        if (selectedForm.syllablesPerLine) {
            let syllableValid = true;
            let syllableMessages = [];
            selectedForm.syllablesPerLine.forEach((expected, i) => {
                if (i >= syllableCounts.length) return;
                if (typeof expected === 'object') {
                    if (syllableCounts[i] < expected.min || syllableCounts[i] > expected.max) {
                        syllableValid = false;
                        syllableMessages.push(`Line ${i + 1}: Expected ${expected.min}-${expected.max} syllables, found ${syllableCounts[i]}.`);
                    }
                } else {
                    if (syllableCounts[i] !== expected) {
                        syllableValid = false;
                        syllableMessages.push(`Line ${i + 1}: Expected ${expected} syllables, found ${syllableCounts[i]}.`);
                    }
                }
            });
            analysis.syllables.valid = syllableValid;
            analysis.syllables.message = syllableMessages.join('<br>');
        }
    } catch (error) {
        console.error('Syllable counting error:', error);
        resultsDiv.innerHTML = '<p class="error">Error: Failed to count syllables. Please check input.</p>';
        return;
    }

    // Rhyme scheme detection
    if (selectedForm.rhymeScheme) {
        const detectedRhymes = detectRhymeScheme(lines);
        const expectedRhymes = selectedForm.rhymeScheme.replace(/\s/g, '');
        if (detectedRhymes !== expectedRhymes) {
            analysis.rhyme.valid = false;
            analysis.rhyme.message = `Expected rhyme scheme ${selectedForm.rhymeScheme}, but found ${detectedRhymes}.`;
        }
    }

    // Meter analysis
    if (selectedForm.meter) {
        let meterIssues = [];
        if (selectedForm.meter.includes('iambic')) {
            meterIssues = lines.map((line, i) => {
                const syllables = countSyllables(line);
                if (syllables % 2 !== 0) {
                    return `Line ${i + 1}: Expected even syllables for iambic meter, found ${syllables}.`;
                }
                return null;
            }).filter(issue => issue);
        } else if (selectedForm.meter.includes('dactylic')) {
            meterIssues = lines.map((line, i) => {
                const syllables = countSyllables(line);
                if (syllables % 3 !== 0) {
                    return `Line ${i + 1}: Expected syllables divisible by 3 for dactylic meter, found ${syllables}.`;
                }
                return null;
            }).filter(issue => issue);
        } else if (selectedForm.meter.includes('anapestic')) {
            meterIssues = lines.map((line, i) => {
                const syllables = countSyllables(line);
                if (syllables % 3 !== 0) {
                    return `Line ${i + 1}: Expected syllables divisible by 3 for anapestic meter, found ${syllables}.`;
                }
                return null;
            }).filter(issue => issue);
        }
        if (meterIssues.length > 0) {
            analysis.meter.valid = false;
            analysis.meter.message = meterIssues.join('<br>');
        }
    }

    // Special rules
    if (selectedForm.specialRules) {
        if (typeof selectedForm.specialRules === 'string') {
            analysis.special.valid = false;
            analysis.special.message = selectedForm.specialRules;
        } else {
            let specialValid = true;
            let specialMessages = [];

            // Refrains (e.g., villanelle, pantoum, rondeau)
            if (selectedForm.specialRules.refrains) {
                selectedForm.specialRules.refrains.forEach(refrain => {
                    const baseLine = lines[refrain.line - 1]?.trim().toLowerCase();
                    if (!baseLine) {
                        specialValid = false;
                        specialMessages.push(`Line ${refrain.line} (refrain) is missing.`);
                        return;
                    }
                    refrain.repeats.forEach(repeatLine => {
                        const repeat = lines[repeatLine - 1]?.trim().toLowerCase();
                        if (repeat !== baseLine) {
                            specialValid = false;
                            specialMessages.push(`Line ${repeatLine} should repeat line ${refrain.line}.`);
                        }
                    });
                });
            }

            // End-word patterns (e.g., sestina)
            if (selectedForm.specialRules.endWordPattern) {
                const endWords = lines.slice(0, 36).map(line => {
                    const words = line.trim().split(/\s+/);
                    return words[words.length - 1]?.toLowerCase() || '';
                });
                selectedForm.specialRules.endWordPattern.forEach((pattern, stanza) => {
                    const stanzaWords = endWords.slice(stanza * 6, (stanza + 1) * 6);
                    if (stanzaWords.length < 6) {
                        specialValid = false;
                        specialMessages.push(`Stanza ${stanza + 1}: Too few lines for sestina pattern.`);
                        return;
                    }
                    pattern.forEach((wordIndex, line) => {
                        const expectedWord = endWords[(stanza === 0 ? wordIndex - 1 : selectedForm.specialRules.endWordPattern[stanza - 1][wordIndex - 1] - 1)];
                        if (stanzaWords[line] !== expectedWord) {
                            specialValid = false;
                            specialMessages.push(`Stanza ${stanza + 1}, line ${line + 1}: Expected end word "${expectedWord}", found "${stanzaWords[line]}".`);
                        }
                    });
                });
                if (endWords.length >= 39) {
                    const tercetWords = endWords.slice(36, 39).map(word => word.split(/\s+/).slice(-2).join(' '));
                    selectedForm.specialRules.tercetEndWords.forEach((wordIndex, i) => {
                        const expectedWord = endWords[wordIndex - 1];
                        if (!tercetWords[i].includes(expectedWord)) {
                            specialValid = false;
                            specialMessages.push(`Tercet line ${i + 1}: Expected end word "${expectedWord}".`);
                        }
                    });
                }
            }

            // Acrostic
            if (selectedForm.specialRules === "First letters spell a word.") {
                const firstLetters = lines.map(line => line.trim()[0]?.toLowerCase() || '');
                const acrosticWord = firstLetters.join('');
                if (!acrosticWord.match(/^[a-z]+$/)) {
                    specialValid = false;
                    specialMessages.push(`First letters do not form a valid word: "${acrosticWord}".`);
                }
            }

            // Golden Shovel
            if (selectedForm.specialRules === "Requires a source line; end words must match source.") {
                specialValid = false;
                specialMessages.push("Cannot verify source line programmatically. Ensure end words match a source line.");
            }

            // Chain Verse
            if (selectedForm.specialRules === "Last word of each line starts the next.") {
                for (let i = 0; i < lines.length - 1; i++) {
                    const lastWord = lines[i].trim().split(/\s+/).pop()?.toLowerCase();
                    const nextFirstWord = lines[i + 1].trim().split(/\s+/)[0]?.toLowerCase();
                    if (lastWord !== nextFirstWord) {
                        specialValid = false;
                        specialMessages.push(`Line ${i + 2} should start with "${lastWord}".`);
                    }
                }
            }

            // Echo Verse
            if (selectedForm.specialRules === "Last syllable or word echoes.") {
                for (let i = 0; i < lines.length; i += 2) {
                    if (i + 1 >= lines.length) break;
                    const lastWord = lines[i].trim().split(/\s+/).pop()?.toLowerCase();
                    const echo = lines[i + 1].trim().toLowerCase();
                    if (lastWord !== echo) {
                        specialValid = false;
                        specialMessages.push(`Line ${i + 2} should echo "${lastWord}".`);
                    }
                }
            }

            // Glosa
            if (selectedForm.specialRules === "Each stanza ends with a line from the source quatrain.") {
                specialValid = false;
                specialMessages.push("Cannot verify source quatrain programmatically. Ensure each stanza ends with a source line.");
            }

            // Diamante
            if (selectedForm.specialRules === "Lines 1 and 7 are nouns; lines 2 and 6 are adjectives; lines 3 and 5 are verbs; line 4 has four nouns.") {
                const words = lines.map(line => line.trim().split(/\s+/));
                if (words[0]?.length !== 1 || words[6]?.length !== 1) {
                    specialValid = false;
                    specialMessages.push("Lines 1 and 7 must be single nouns.");
                }
                if (words[1]?.length !== 2 || words[5]?.length !== 2) {
                    specialValid = false;
                    specialMessages.push("Lines 2 and 6 must have two adjectives.");
                }
                if (words[2]?.length !== 3 || words[4]?.length !== 3) {
                    specialValid = false;
                    specialMessages.push("Lines 3 and 5 must have three verbs.");
                }
                if (words[3]?.length !== 4) {
                    specialValid = false;
                    specialMessages.push("Line 4 must have four nouns.");
                }
            }

            // Haibun
            if (selectedForm.specialRules === "Includes prose and at least one haiku (5-7-5 syllables).") {
                specialValid = false;
                specialMessages.push("Cannot analyze prose and haiku combination programmatically. Ensure at least one 5-7-5 haiku.");
            }

            // Mirror Poem
            if (selectedForm.specialRules === "Second half mirrors first half.") {
                const half = Math.floor(lines.length / 2);
                for (let i = 0; i < half; i++) {
                    const first = lines[i]?.trim().toLowerCase();
                    const mirror = lines[lines.length - 1 - i]?.trim().toLowerCase();
                    if (first !== mirror) {
                        specialValid = false;
                        specialMessages.push(`Line ${lines.length - i} should mirror line ${i + 1}.`);
                    }
                }
            }

            // Palindrome Poem
            if (selectedForm.specialRules === "Reads the same forwards and backwards.") {
                for (let i = 0; i < Math.floor(lines.length / 2); i++) {
                    const forward = lines[i]?.trim().toLowerCase();
                    const backward = lines[lines.length - 1 - i]?.trim().toLowerCase();
                    if (forward !== backward) {
                        specialValid = false;
                        specialMessages.push(`Line ${lines.length - i} should match line ${i + 1} for palindrome structure.`);
                    }
                }
            }

            // Tongue Twister
            if (selectedForm.specialRules === "Heavy alliteration required.") {
                const alliteration = lines.every(line => {
                    const words = line.trim().split(/\s+/);
                    const firstLetter = words[0]?.[0]?.toLowerCase();
                    return words.every(word => word[0]?.toLowerCase() === firstLetter);
                });
                if (!alliteration) {
                    specialValid = false;
                    specialMessages.push("Each line should use heavy alliteration (same starting letter).");
                }
            }

            // Word Sonnet
            if (selectedForm.specialRules === "One word per line.") {
                const singleWords = lines.every(line => line.trim().split(/\s+/).length === 1);
                if (!singleWords) {
                    specialValid = false;
                    specialMessages.push("Each line must contain exactly one word.");
                }
            }

            analysis.special.valid = specialValid;
            analysis.special.message = specialMessages.join('<br>');
        }
    }

    // Generate results
    resultsDiv.innerHTML = `
        <h3>Analysis for ${selectedForm.name.charAt(0).toUpperCase() + selectedForm.name.slice(1)}</h3>
        <p><strong>Line Count:</strong> ${analysis.lineCount.valid ? '✓ Correct' : '✗ ' + analysis.lineCount.message}</p>
        <p><strong>Syllables:</strong> ${analysis.syllables.valid ? '✓ Correct' : '✗ ' + analysis.syllables.message}</p>
        <p><strong>Rhyme Scheme:</strong> ${analysis.rhyme.valid ? '✓ Correct' : '✗ ' + analysis.rhyme.message}</p>
        <p><strong>Meter:</strong> ${analysis.meter.valid ? '✓ Likely correct' : '✗ ' + analysis.meter.message}</p>
        <p><strong>Special Rules:</strong> ${analysis.special.valid ? '✓ Correct' : '✗ ' + analysis.special.message}</p>
        <p><strong>Suggestions:</strong> ${generateSuggestions(analysis, selectedForm)}</p>
    `;
}

function countSyllables(line) {
    line = line.toLowerCase().trim();
    if (!line) return 0;
    const words = line.split(/\s+/);
    let syllables = 0;
    words.forEach(word => {
        // Check cmudict.json first
        if (dictionaryLoaded && dictionary.length > 0) {
            const entry = dictionary.find(item => item.text.toLowerCase() === word);
            if (entry) {
                const count = entry.stress.length;
                syllables += count;
                console.log(`Word: ${word}, Syllables: ${count} (cmudict)`);
                return;
            }
        }
        // Fallback to syllable library
        try {
            const count = window.syllable(word);
            syllables += count;
            console.log(`Word: ${word}, Syllables: ${count} (syllable library)`);
        } catch (error) {
            console.error(`Error counting syllables for ${word}:`, error);
            syllables += 1; // Default to 1 if library fails
            console.log(`Word: ${word}, Syllables: 1 (default)`);
        }
    });
    console.log(`Line: "${line}", Total Syllables: ${syllables}`);
    return syllables;
}

function detectRhymeScheme(lines) {
    const endWords = lines.map(line => {
        const words = line.trim().split(/\s+/);
        return words[words.length - 1]?.toLowerCase() || '';
    });
    const rhymes = {};
    let currentRhyme = 'A';
    endWords.forEach((word, i) => {
        if (!word) return;
        let assigned = false;
        for (const [rhyme, words] of Object.entries(rhymes)) {
            if (words.some(w => simpleRhymeMatch(w, word))) {
                rhymes[rhyme].push(word);
                assigned = true;
                break;
            }
        }
        if (!assigned) {
            rhymes[currentRhyme] = [word];
            currentRhyme = String.fromCharCode(currentRhyme.charCodeAt(0) + 1);
        }
    });
    return endWords.map(word => {
        for (const [rhyme, words] of Object.entries(rhymes)) {
            if (words.includes(word)) return rhyme;
        }
        return '';
    }).join('');
}

function simpleRhymeMatch(word1, word2) {
    return word1.slice(-3) === word2.slice(-3);
}

function generateSuggestions(analysis, form) {
    const suggestions = [];
    if (!analysis.lineCount.valid) {
        suggestions.push(`Adjust the poem to have ${analysis.lineCount.message.match(/Expected (\d+)/)?.[1] || form.lineCount} lines.`);
    }
    if (!analysis.syllables.valid) {
        suggestions.push(`Revise lines to match the expected syllable counts. Try shorter or longer words.`);
    }
    if (!analysis.rhyme.valid) {
        suggestions.push(`Check end words to match the expected rhyme scheme. Use a rhyming dictionary if needed.`);
    }
    if (!analysis.meter.valid) {
        suggestions.push(`Ensure lines follow the expected stress pattern (e.g., unstressed-stressed for iambic).`);
    }
    if (!analysis.special.valid) {
        if (form.specialRules?.refrains) {
            suggestions.push(`Ensure refrains repeat exactly as required in the specified lines.`);
        }
        if (form.specialRules?.endWordPattern) {
            suggestions.push(`Check end words to follow the sestina’s rotation pattern.`);
        }
        if (form.specialRules === "First letters spell a word.") {
            suggestions.push(`Ensure the first letters of each line spell a valid word.`);
        }
        if (form.specialRules === "Last word of each line starts the next.") {
            suggestions.push(`Ensure the last word of each line is the first word of the next.`);
        }
        if (form.specialRules === "Last syllable or word echoes.") {
            suggestions.push(`Ensure each odd-numbered line’s last word is echoed in the next line.`);
        }
        if (form.specialRules === "One word per line.") {
            suggestions.push(`Ensure each line contains exactly one word.`);
        }
        if (typeof form.specialRules === 'string' && form.specialRules.includes('Cannot be analyzed')) {
            suggestions.push(`This form cannot be fully analyzed programmatically. Review the form’s requirements.`);
        }
    }
    return suggestions.length > 0 ? suggestions.join(' ') : 'Your poem looks great!';
}