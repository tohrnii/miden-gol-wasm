use miden::{execute, Assembler, ProgramInputs, Program};
use wasm_bindgen::prelude::*;


#[wasm_bindgen]
pub struct WasmProgram {
    program: Program,
    program_inputs: ProgramInputs,
    curr_state: Vec<u64>
}

#[wasm_bindgen]
impl WasmProgram {
    #[wasm_bindgen(constructor)]
    pub fn new(input: Vec<u64>) -> WasmProgram {
        let (program, program_inputs) = compile(&input);
        WasmProgram {
            program: program,
            program_inputs: program_inputs,
            curr_state: input
        }
    }

    pub fn set_input(&mut self, input: Vec<u64>) {
        self.curr_state = input;
        self.program_inputs = ProgramInputs::from_stack_inputs(&self.curr_state).expect("could not create program inputs");
    }

    pub fn next_step(&mut self) -> Vec<u64> {
        self.curr_state = execute(&self.program, &self.program_inputs).expect("Could not execute program").program_outputs().stack()[..16].to_vec();
        self.program_inputs = ProgramInputs::from_stack_inputs(&self.curr_state).expect("could not create program inputs");
        self.curr_state.clone()
    }

}

pub fn compile(inputs: &[u64]) -> (Program, ProgramInputs) {
    let path = "gol.masm";
    let source = std::fs::read_to_string(path).expect("Could not read source file");
    let assembler = Assembler::new(false);
    let program = assembler.compile(&source).unwrap();
    let program_inputs = ProgramInputs::from_stack_inputs(&inputs).expect("could not create program inputs");
    (program, program_inputs)
}