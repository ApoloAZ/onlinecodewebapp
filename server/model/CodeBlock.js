import { Schema, model } from "mongoose"

const codeBlockModel = new Schema(
    {
        title: {type:String},
        currentCode: {type:String},
        solutionCode: {type:String}
    },
)

const CodeBlock = model("CodeBlock", codeBlockModel)
export default CodeBlock;