import { Schema, model } from "mongoose"

const codeBlockModel = new Schema(
    {
        title: {type:String},
        current_code: {type:String},
        solution_code: {type:String}
    },
    {
        timestamps: true
    }
)

export const CodeBlock = model("CodeBlock", codeBlockModel)