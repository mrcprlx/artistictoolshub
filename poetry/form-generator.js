const forms = [
    { name: "sonnet", description: "A 14-line poem with a specific rhyme scheme, often iambic pentameter.", example: "Shakespeare’s 'Shall I compare thee to a summer’s day?'" },
    { name: "haiku", description: "A 3-line Japanese form with a 5-7-5 syllable count, often capturing a nature moment.", example: "An old silent pond / A frog jumps into the pond— / Splash! Silence again (Basho)." },
    { name: "limerick", description: "A 5-line humorous poem with an AABBA rhyme scheme.", example: "There was an old man from Peru / Whose limericks would end line two." },
    { name: "free verse", description: "A poem with no set meter or rhyme scheme, focusing on natural speech rhythms.", example: "Walt Whitman’s 'Song of Myself'." },
    { name: "villanelle", description: "A 19-line poem with five tercets and a quatrain, using two refrains and an ABA rhyme scheme.", example: "Dylan Thomas’ 'Do not go gentle into that good night'." },
    { name: "sestina", description: "A 39-line poem with six sestets and a tercet, using a complex pattern of end-word repetition.", example: "Elizabeth Bishop’s 'Sestina'." },
    { name: "ode", description: "A lyrical poem expressing emotion, often addressing a person or thing.", example: "Keats’ 'Ode to a Nightingale'." },
    { name: "elegy", description: "A mournful poem, often lamenting the dead.", example: "Whitman’s 'O Captain! My Captain!'." },
    { name: "ballad", description: "A narrative poem, often with a simple meter and rhyme, telling a story.", example: "Coleridge’s 'The Rime of the Ancient Mariner'." },
    { name: "blank verse", description: "Unrhymed iambic pentameter, often used in epic poetry.", example: "Milton’s 'Paradise Lost'." },
    { name: "ghazal", description: "A Persian form with couplets, a refrain, and a rhyme scheme, often about love or loss.", example: "Agha Shahid Ali’s 'Even the Rain'." },
    { name: "tanka", description: "A 5-line Japanese form with a 5-7-5-7-7 syllable count, often extending a haiku.", example: "A traditional tanka: The moon on the lake / Shimmers like a silver fish / Slipping through my hands / In the night’s embrace I dream / Of a love that never ends." },
    { name: "pantoum", description: "A Malay form with repeating lines in a pattern across quatrains.", example: "Baudelaire’s 'Harmonie du soir'." },
    { name: "terza rima", description: "A three-line stanza form with an interlocking rhyme scheme (ABA BCB CDC).", example: "Dante’s 'Divine Comedy'." },
    { name: "rondeau", description: "A French form with 15 lines, two rhymes, and a refrain.", example: "John McCrae’s 'In Flanders Fields'." },
    { name: "triolet", description: "An 8-line French form with two rhymes and two refrains (ABaAabAB).", example: "Thomas Hardy’s 'The Convergence of the Twain'." },
    { name: "clerihew", description: "A humorous 4-line poem with an AABB rhyme scheme about a person.", example: "Edmund Clerihew Bentley’s 'Sir Christopher Wren'." },
    { name: "kyrielle", description: "A French form with 8-syllable lines in couplets, ending with a refrain.", example: "A medieval hymn: Lord, have mercy on us all." },
    { name: "fib", description: "A 6-line poem with syllable counts based on the Fibonacci sequence (1-1-2-3-5-8).", example: "Snow / Falls / Gentle / Flakes drift / Swirling down / Blanketing the earth in white." },
    { name: "blackout poetry", description: "A form where words are redacted from a text to create a new poem.", example: "Created from a newspaper article: 'Whispers of dawn / Break through the silence'." },
    { name: "golden shovel", description: "A form where each word of a line from another poem becomes the last word of each line in the new poem.", example: "Terrance Hayes’ 'The Golden Shovel' after Gwendolyn Brooks." },
    { name: "acrostic", description: "A poem where the first letter of each line spells out a word.", example: "Using 'BEAR': Busting into my trash can / Eating everything he can find / A bear is living / Right in my backyard." },
    { name: "cinquain", description: "A 5-line poem with a 2-4-6-8-2 syllable count, often describing a subject.", example: "Adelaide Crapsey’s 'November Night'." },
    { name: "couplet", description: "A two-line poem or stanza with a consistent rhyme scheme.", example: "The rose blooms red / Upon the bed." },
    { name: "quatrain", description: "A four-line stanza with various possible rhyme schemes (e.g., ABAB, AABB).", example: "The cat sits still / Upon the hill / Watching the sky / As clouds drift by." },
    { name: "renga", description: "A Japanese collaborative form with linked tanka stanzas.", example: "A traditional renga alternates between poets, building a nature narrative." },
    { name: "rubai", description: "A Persian quatrain with an AABA rhyme scheme, often philosophical.", example: "Omar Khayyam’s 'Rubaiyat'." },
    { name: "lai", description: "A French form with 9 lines in three tercets, using two rhymes.", example: "A medieval lai: The knight rode forth / With love in his heart / To seek his north." },
    { name: "virelai", description: "A French form with three-line stanzas and a complex rhyme scheme.", example: "A medieval virelai about courtly love." },
    { name: "sijo", description: "A Korean form with three lines of 14–16 syllables each, often reflective.", example: "A traditional sijo: The stream flows gently / Whispering secrets to the stones / I sit and listen." },
    { name: "epigram", description: "A short, witty poem or statement, often satirical.", example: "Alexander Pope’s 'I am his Highness’ dog at Kew'." },
    { name: "pastoral", description: "A poem idealizing rural life or shepherds.", example: "Marlowe’s 'The Passionate Shepherd to His Love'." },
    { name: "aubade", description: "A poem about dawn or morning, often involving lovers parting.", example: "Donne’s 'The Sun Rising'." },
    { name: "palinode", description: "A poem that retracts a previous statement or poem.", example: "Chaucer’s retraction at the end of 'The Canterbury Tales'." },
    { name: "epithalamion", description: "A poem written to celebrate a marriage.", example: "Spenser’s 'Epithalamion'." },
    { name: "found poetry", description: "A poem created by taking words from other texts and rearranging them.", example: "Using a page from a novel: 'Shadows dance / In the flickering light'." },
    { name: "concrete poetry", description: "A poem where the visual arrangement of words reflects the subject.", example: "A poem about a tree shaped like a tree on the page." },
    { name: "diamante", description: "A 7-line poem in a diamond shape, comparing two subjects.", example: "Cat / Soft, sleek / Purring, stalking, napping / Feline, predator, canine, companion / Barking, running, fetching / Loud, loyal / Dog." },
    { name: "nonet", description: "A 9-line poem with a syllable count decreasing from 9 to 1.", example: "The sunset paints the sky with fiery hues / Colors blend into a warm embrace / A fleeting moment of pure peace / The light begins to fade away / Stars peek through the twilight / Night wraps the world in calm / A whisper of breeze / The moon rises / Still." },
    { name: "tetractys", description: "A 5-line poem with syllable counts 1-2-3-4-10.", example: "Love / Whispers / In the night / Softly calling / A tender heart answers with endless delight." },
    { name: "monostich", description: "A one-line poem, often concise and impactful.", example: "A single tear falls silently." },
    { name: "ghazal", description: "A form with couplets, each ending with the same word or phrase, often about longing.", example: "Rumi’s ghazals of divine love." },
    { name: "ottava rima", description: "An 8-line stanza with an ABABABCC rhyme scheme.", example: "Byron’s 'Don Juan'." },
    { name: "spenserian stanza", description: "A 9-line stanza with an ABABBCBCC rhyme scheme, often in iambic pentameter.", example: "Spenser’s 'The Faerie Queene'." },
    { name: "ballade", description: "A French form with three 8-line stanzas and a 4-line envoi, using an ABABBCBC rhyme scheme.", example: "Chaucer’s 'Ballade of Good Counsel'." },
    { name: "chain verse", description: "A form where the last word or phrase of one line begins the next.", example: "The sky turns dark / Dark clouds gather / Gather rain to fall / Fall gently on the earth." },
    { name: "echo verse", description: "A form where the last syllable or word of each line is repeated as an echo.", example: "I call to the hills—hills / They answer with thrills—thrills." },
    { name: "glosa", description: "A form that takes a quatrain from another poem and expands on it in four 10-line stanzas.", example: "P.K. Page’s 'Glosa' after Rilke." },
    { name: "bref double", description: "A 14-line French form with three rhymes used in varying patterns.", example: "A medieval bref double about a knight’s quest." },
    { name: "rondelet", description: "A 7-line French form with a refrain and an ABaAabA rhyme scheme.", example: "A rondelet: The moon does glow / In night’s embrace / Its silver show / The moon does glow / Lights up the snow / In a soft grace / The moon does glow." },
    { name: "troubadour poetry", description: "Medieval lyric poetry by troubadours, often about courtly love.", example: "A canso by Bernart de Ventadorn." },
    { name: "canzone", description: "An Italian form with stanzas of equal length, often about love.", example: "Petrarch’s 'Canzoniere'." },
    { name: "carpe diem", description: "A poem urging to seize the day, often about love or mortality.", example: "Herrick’s 'To the Virgins, to Make Much of Time'." },
    { name: "cento", description: "A poem made entirely of lines from other poems.", example: "A cento using lines from Dickinson and Whitman." },
    { name: "chance operations", description: "A form using random methods to determine structure or content.", example: "John Cage’s experimental poetry." },
    { name: "cut-up technique", description: "A form where text is cut and rearranged to create a new poem.", example: "William S. Burroughs’ cut-up poetry." },
    { name: "double dactyl", description: "A humorous 8-line poem with a specific dactylic meter.", example: "Higgledy piggledy / Emily Dickinson / Wrote of the soul with such / Fierce intensity." },
    { name: "etheree", description: "A 10-line poem with syllable counts increasing from 1 to 10.", example: "Snow / Falls down / In soft flakes / Covering the ground / A blanket of pure white / Shimmering in the moonlight / Cold air bites at uncovered skin / A quiet world wrapped in winter’s charm / The silence sings a song of peace and calm / Nature’s beauty unfolds in this frozen scene." },
    { name: "flarf", description: "A modern form using internet search results to create absurd poetry.", example: "A poem using random Google search snippets." },
    { name: "haibun", description: "A Japanese form combining prose and haiku, often about travel.", example: "Basho’s 'The Narrow Road to the Deep North'." },
    { name: "list poem", description: "A poem structured as a list, often thematic.", example: "A list of things found in a poet’s desk: A quill, a crumpled note, a dream." },
    { name: "luc bat", description: "A Vietnamese form with alternating 6- and 8-syllable lines, rhyming at specific points.", example: "A traditional luc bat about a river’s journey." },
    { name: "mirror poem", description: "A poem where the second half mirrors the first in structure or theme.", example: "The first half describes dawn, the second dusk." },
    { name: "palindrome poem", description: "A poem that reads the same forwards and backwards at the word or line level.", example: "A short palindrome poem: Rise / Eyes / See / Eyes / Rise." },
    { name: "paradelle", description: "A modern, complex form with repeating lines in a specific pattern.", example: "Billy Collins’ 'Paradelle for Susan'." },
    { name: "prose poetry", description: "A poem written in prose form but with poetic qualities.", example: "Baudelaire’s 'Be Drunk'." },
    { name: "riddle poem", description: "A poem that describes something indirectly, inviting the reader to guess the subject.", example: "I speak without a mouth—wind." },
    { name: "sapphic stanza", description: "A four-line stanza with a specific meter, used by Sappho.", example: "A modern sapphic: The moon’s gentle glow / Lights the path below / Stars whisper secrets / In the night’s embrace." },
    { name: "skeltonic verse", description: "A form with short, rhyming lines and a playful tone.", example: "John Skelton’s 'Speke Parott'." },
    { name: "tongue twister poem", description: "A poem using alliteration and difficult sounds for playful effect.", example: "Silly Sally swiftly shooed seven silly sheep." },
    { name: "vers libre", description: "Another term for free verse, emphasizing freedom from traditional forms.", example: "T.S. Eliot’s 'The Love Song of J. Alfred Prufrock'." },
    { name: "word sonnet", description: "A 14-line poem with one word per line.", example: "Love / Burns / Bright / Yet / Fades / In / Time / We / Seek / Its / Flame / To / Hold / Forever." }
];

// Populate the dropdown with all forms when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const formSelect = document.getElementById('form-select');
    forms.forEach(form => {
        const option = document.createElement('option');
        option.value = form.name;
        option.textContent = form.name.charAt(0).toUpperCase() + form.name.slice(1);
        formSelect.appendChild(option);
    });
});

function generateForm() {
    const formSelect = document.getElementById('form-select');
    const selectedFormName = formSelect.value;
    const resultsDiv = document.getElementById('form-results');
    resultsDiv.innerHTML = 'Generating...';

    const selectedForm = forms.find(form => form.name === selectedFormName);
    if (selectedForm) {
        resultsDiv.innerHTML = `
            <h3>${selectedForm.name.charAt(0).toUpperCase() + selectedForm.name.slice(1)}</h3>
            <p><strong>Description:</strong> ${selectedForm.description}</p>
            <p><strong>Example:</strong> ${selectedForm.example}</p>
        `;
    } else {
        resultsDiv.innerHTML = '<p>Error: Form not found. Please try again.</p>';
    }
}