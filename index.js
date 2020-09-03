const { ux, sdk } = require('@cto.ai/sdk')
async function main() {

  const { selection } = await ux.prompt({
    type: "list",
    name: 'selection',
    message: 'Do you want to create a new incident, or modify an existing incident?',
    choices: ["Trigger new Incident", "Modify status of existing Incident"]
  });

  const isNewIncident = selection === "Trigger new Incident";

  let identifier_prompt;

  if (isNewIncident) {
    identifier_prompt = "Please enter a unique identifier for your new incident";
  } else {
    identifier_prompt = "Please enter the unique identifier for your incident";
  }

  const { incident_identifier } = await ux.prompt({
    type: "input",
    name: 'incident_identifier',
    message: identifier_prompt,
  });

  let new_incident_status;
  if (isNewIncident) {
    new_incident_status = "Initialized";
  } else {
    const obj = await ux.prompt({
      type: "list",
      name: 'new_incident_status',
      message: "Enter the new status for your incident",
      choices: ["Failed", "Succeeded"]
    });
    new_incident_status = obj.new_incident_status;
  }

  sdk.track([], {
    stage: "Incident",
    status: new_incident_status,
    stage_ref: incident_identifier
  });

  ux.print(`Incident ${incident_identifier} has been set to ${new_incident_status}.`);
};
main();
