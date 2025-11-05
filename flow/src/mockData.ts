export const mockFlowData = [
  {
    title: "User Authentication Flow",
    flows: [
      {
        offBoard: {
          smartPhone: JSON.stringify({
            type: "Mobile App",
            component: "Authentication Service",
            description: "User initiates login",
            preAsilLevel: "QM",
            postAsilLevel: "QM"
          }),
          p2c: {
            direction: "right",
            signal: JSON.stringify({
              endpointUrl: "https://api.example.com/auth",
              name: "Auth Request",
              protocol: "HTTPS"
            })
          },
          cloud: JSON.stringify({
            type: "Cloud Service",
            component: "Auth Server",
            description: "Validates credentials",
            preAsilLevel: "A",
            postAsilLevel: "QM"
          })
        },
        v2c: {
          direction: "bi-direction",
          signal: JSON.stringify({
            endpointUrl: "https://api.example.com/vehicle",
            name: "Vehicle Status",
            protocol: "MQTT"
          })
        },
        onBoard: {
          sdvRuntime: JSON.stringify({
            type: "Runtime Service",
            component: "Vehicle OS",
            description: "Processes vehicle commands",
            preAsilLevel: "B",
            postAsilLevel: "QM"
          }),
          s2s: {
            direction: "right",
            signal: JSON.stringify({
              name: "CAN Bus Signal",
              protocol: "CAN"
            })
          },
          embedded: JSON.stringify({
            type: "ECU",
            component: "Body Control Module",
            description: "Controls vehicle functions",
            preAsilLevel: "C",
            postAsilLevel: "B"
          }),
          s2e: {
            direction: "right",
            signal: JSON.stringify({
              name: "Sensor Data",
              protocol: "LIN"
            })
          },
          sensors: JSON.stringify({
            type: "Sensor",
            component: "Temperature Sensor",
            description: "Monitors temperature",
            preAsilLevel: "QM",
            postAsilLevel: "QM"
          })
        }
      }
    ]
  },
  {
    title: "Vehicle Control Flow",
    flows: [
      {
        offBoard: {
          smartPhone: "Remote Start Command <ASIL-A>",
          p2c: {
            direction: "right",
            signal: "Command Signal"
          },
          cloud: "Process Command <ASIL-B>"
        },
        v2c: {
          direction: "down-right",
          signal: "Vehicle Control Signal"
        },
        onBoard: {
          sdvRuntime: "Execute Command <ASIL-C>",
          s2s: {
            direction: "bi-direction",
            signal: "System Communication"
          },
          embedded: "Control Unit Response <ASIL-D>",
          s2e: {
            direction: "left",
            signal: "Feedback Signal"
          },
          sensors: "Sensor Reading <QM>"
        }
      }
    ]
  }
];

