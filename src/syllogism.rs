use rand::prelude::*;
use std::collections::HashSet;

fn generate_random_syllable(rng: &mut impl Rng) -> [u8; 3] {
    [
        rng.gen_range(b'a'..=b'z'),
        rng.gen_range(b'a'..=b'z'),
        rng.gen_range(b'a'..=b'z'),
    ]
}

pub fn generate_syllogism(n: usize) -> (String, String) {
    let mut rng = thread_rng();
    let mut syllables = Vec::with_capacity(n);
    let mut seen = HashSet::with_capacity(n);

    while syllables.len() < n {
        let new_syl = generate_random_syllable(&mut rng);
        if seen.insert(new_syl) {
            syllables.push(new_syl);
        }
    }

    let syllogism = syllables
        .iter()
        .map(|syl| std::str::from_utf8(syl).unwrap())
        .collect::<Vec<_>>()
        .join(" > ");

    let syllable_index = rng.gen_range(1..n);
    let preceding_index = rng.gen_range(0..syllable_index);

    let question = format!(
        "Is {} > {}?",
        std::str::from_utf8(&syllables[syllable_index]).unwrap(),
        std::str::from_utf8(&syllables[preceding_index]).unwrap()
    );

    (syllogism, question)
}