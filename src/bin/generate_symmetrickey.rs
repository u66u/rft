use pasetors::keys::{Generate, SymmetricKey};
use pasetors::paserk::FormatAsPaserk;
use pasetors::version4::V4;

fn main() {
    let sk = SymmetricKey::<V4>::generate().unwrap();
    let mut paserk = String::new();
    sk.fmt(&mut paserk).unwrap();
    println!("{}", paserk);
}
