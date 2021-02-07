const express = require("express");
const expressWs = require("express-ws");
const bodyParser = require("body-parser");
import { Engine } from "bpmn-engine";
import { EventEmitter } from "events";

const listener = new EventEmitter();
const app = express();
app.use(bodyParser.json());
expressWs(app);

app.post("/engine/execute", function (req, res) {
	const id = Math.floor(Math.random() * 10000);

	const source = `
    <?xml version="1.0" encoding="UTF-8"?>
      <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
      <process id="theProcess2" isExecutable="true">
        <startEvent id="theStart" />
        <exclusiveGateway id="decision" default="flow2" />
        <endEvent id="end1" />
        <endEvent id="end2" />
        <sequenceFlow id="flow1" sourceRef="theStart" targetRef="decision" />
        <sequenceFlow id="flow2" sourceRef="decision" targetRef="end1" />
        <sequenceFlow id="flow3" sourceRef="decision" targetRef="end2">
          <conditionExpression>true</conditionExpression>
        </sequenceFlow>
      </process>
    </definitions>`;

	const engine = Engine({
		name: "execution example",
		source,
		variables: {
			id,
		},
	});

	engine.execute({ listener }, (err, execution) => {
		console.log("Execution completed with id", execution.environment.variables.id);
	});

	listener.on("activity.enter", (execution) => {
		console.log("ENTER");
		console.log(execution.environment.getState());
	});

	listener.on("activity.start", (execution) => {
		console.log("START");
		console.log(execution.environment.getState());
	});

	listener.on("activity.wait", (execution) => {
		console.log("WAIT");
		console.log(execution.environment.getState());
	});

	listener.on("activity.end", (execution) => {
		console.log("END");
		console.log(execution.environment.getState());
	});

	listener.on("activity.leave", (execution) => {
		console.log("LEAVE");
		console.log(execution.environment.getState());
	});

	listener.on("activity.stop", (execution) => {
		console.log("STOP");
		console.log(execution.environment.getState());
	});

	listener.on("activity.throw", (execution) => {
		console.log("THROW");
		console.log(execution.environment.getState());
	});

	listener.on("activity.error", (execution) => {
		console.log("ERROR");
		console.log(execution.environment.getState());
	});

	listener.on("flow.take", (execution) => {
		console.log("TAKE");
		console.log(execution.environment.getState());
	});

	listener.on("flow.discard", (execution) => {
		console.log("DISCARD");
		console.log(execution.environment.getState());
	});

	listener.on("flow.looped", (execution) => {
		console.log("LOOPED");
		console.log(execution.environment.getState());
	});
});

app.listen(80, function () {});
