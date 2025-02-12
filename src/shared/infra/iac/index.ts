import * as aws from "@pulumi/aws"
import * as apigateway from "@pulumi/aws-apigateway"
import { APIGatewayProxyEvent } from "aws-lambda"

const fn = new aws.lambda.CallbackFunction("fn", {
    callback: async (ev: APIGatewayProxyEvent) => {
        return {
            statusCode: 200,
            body: ev.body,
        }
    }
})

const api = new apigateway.RestAPI("api", {
    routes: [
        { path: "/date", method: "GET", eventHandler: fn },
    ]
})

export const url = api.url
