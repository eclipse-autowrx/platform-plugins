(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/index.ts
  var ReactDOM = __toESM(__require("react-dom/client"), 1);
  var React2 = __toESM(__require("react"), 1);

  // src/certivityApis.ts
  var supportedCertivityApis = /* @__PURE__ */ new Set([
    "Vehicle.Powertrain.Transmission.CurrentGear",
    "Vehicle.Powertrain.Transmission.SelectedGear",
    "Vehicle.Powertrain.ElectricMotor.MaxPower",
    "Vehicle.Powertrain.ElectricMotor.MaxTorque",
    "Vehicle.Powertrain.ElectricMotor.MaxRegenPower",
    "Vehicle.Powertrain.ElectricMotor.MaxRegenTorque",
    "Vehicle.Powertrain.ElectricMotor.Rpm",
    "Vehicle.Powertrain.ElectricMotor.Temperature",
    "Vehicle.Powertrain.ElectricMotor.CoolantTemperature",
    "Vehicle.Powertrain.ElectricMotor.Power",
    "Vehicle.Powertrain.ElectricMotor.Torque",
    "Vehicle.Powertrain.TractionBattery",
    "Vehicle.Powertrain.TractionBattery.Temperature",
    "Vehicle.Powertrain.TractionBattery.StateOfCharge.Current",
    "Vehicle.Body.Hood",
    "Vehicle.Body.Hood.IsOpen",
    "Vehicle.Body.Trunk.IsOpen",
    "Vehicle.Body.Trunk.IsLocked",
    "Vehicle.Body.Mirrors",
    "Vehicle.Body.Mirrors.Left",
    "Vehicle.Body.Mirrors.Left.Tilt",
    "Vehicle.Body.Mirrors.Left.Pan",
    "Vehicle.Body.Mirrors.Left.Heating",
    "Vehicle.Body.Mirrors.Left.Heating.Status",
    "Vehicle.Body.Mirrors.Right",
    "Vehicle.Body.Mirrors.Right.Tilt",
    "Vehicle.Body.Mirrors.Right.Pan",
    "Vehicle.Body.Mirrors.Right.Heating",
    "Vehicle.Body.Mirrors.Right.Heating.Status",
    "Vehicle.Cabin.Sunroof",
    "Vehicle.Cabin.Sunroof.Position",
    "Vehicle.Cabin.Sunroof.Switch",
    "Vehicle.Cabin.Sunroof.Shade",
    "Vehicle.Cabin.Sunroof.Shade.Switch",
    "Vehicle.Cabin.Sunroof.Shade.Position",
    "Vehicle.Cabin.Door.Row1.Left.IsOpen",
    "Vehicle.Cabin.Door.Row1.Left.IsLocked",
    "Vehicle.Cabin.Door.Row1.Left.Window.isOpen",
    "Vehicle.Cabin.Door.Row1.Left.Window.Position",
    "Vehicle.Cabin.Door.Row1.Left.Window.ChildLock",
    "Vehicle.Cabin.Door.Row1.Left.Window.Switch",
    "Vehicle.Cabin.Door.Row1.Left.IsChildLockActive",
    "Vehicle.Cabin.Door.Row1.Left.Shade.Switch",
    "Vehicle.Cabin.Door.Row1.Left.Shade.Position",
    "Vehicle.Cabin.Door.Row1.Right.IsOpen",
    "Vehicle.Cabin.Door.Row1.Right.IsLocked",
    "Vehicle.Cabin.Door.Row1.Right.Window.isOpen",
    "Vehicle.Cabin.Door.Row1.Right.Window.Position",
    "Vehicle.Cabin.Door.Row1.Right.Window.ChildLock",
    "Vehicle.Cabin.Door.Row1.Right.Window.Switch",
    "Vehicle.Cabin.Door.Row1.Right.IsChildLockActive",
    "Vehicle.Cabin.Door.Row1.Right.Shade.Switch",
    "Vehicle.Cabin.Door.Row1.Right.Shade.Position",
    "Vehicle.Cabin.Door.Row2.Left.IsOpen",
    "Vehicle.Cabin.Door.Row2.Left.IsLocked",
    "Vehicle.Cabin.Door.Row2.Left.Window.isOpen",
    "Vehicle.Cabin.Door.Row2.Left.Window.Position",
    "Vehicle.Cabin.Door.Row2.Left.Window.ChildLock",
    "Vehicle.Cabin.Door.Row2.Left.Window.Switch",
    "Vehicle.Cabin.Door.Row2.Left.IsChildLockActive",
    "Vehicle.Cabin.Door.Row2.Left.Shade.Switch",
    "Vehicle.Cabin.Door.Row2.Left.Shade.Position",
    "Vehicle.Cabin.Door.Row2.Right.IsOpen",
    "Vehicle.Cabin.Door.Row2.Right.IsLocked",
    "Vehicle.Cabin.Door.Row2.Right.Window.isOpen",
    "Vehicle.Cabin.Door.Row2.Right.Window.Position",
    "Vehicle.Cabin.Door.Row2.Right.Window.ChildLock",
    "Vehicle.Cabin.Door.Row2.Right.Window.Switch",
    "Vehicle.Cabin.Door.Row2.Right.IsChildLockActive",
    "Vehicle.Cabin.Door.Row2.Right.Shade.Switch",
    "Vehicle.Cabin.Door.Row2.Right.Shade.Position"
  ]);
  var supportedCertivityApis_v4_map = {
    "Vehicle.Powertrain.Transmission.CurrentGear": "Vehicle.Powertrain.Transmission.CurrentGear",
    "Vehicle.Powertrain.Transmission.SelectedGear": "Vehicle.Powertrain.Transmission.SelectedGear",
    "Vehicle.Powertrain.ElectricMotor.MaxPower": "Vehicle.Powertrain.ElectricMotor.MaxPower",
    "Vehicle.Powertrain.ElectricMotor.MaxTorque": "Vehicle.Powertrain.ElectricMotor.MaxTorque",
    "Vehicle.Powertrain.ElectricMotor.MaxRegenPower": "Vehicle.Powertrain.ElectricMotor.MaxRegenPower",
    "Vehicle.Powertrain.ElectricMotor.MaxRegenTorque": "Vehicle.Powertrain.ElectricMotor.MaxRegenTorque",
    "Vehicle.Powertrain.ElectricMotor.Rpm": "Vehicle.Powertrain.ElectricMotor.Rpm",
    "Vehicle.Powertrain.ElectricMotor.Temperature": "Vehicle.Powertrain.ElectricMotor.Temperature",
    "Vehicle.Powertrain.ElectricMotor.CoolantTemperature": "Vehicle.Powertrain.ElectricMotor.CoolantTemperature",
    "Vehicle.Powertrain.ElectricMotor.Power": "Vehicle.Powertrain.ElectricMotor.Power",
    "Vehicle.Powertrain.ElectricMotor.Torque": "Vehicle.Powertrain.ElectricMotor.Torque",
    "Vehicle.Powertrain.TractionBattery": "Vehicle.Powertrain.TractionBattery",
    "Vehicle.Powertrain.TractionBattery.Temperature": "Vehicle.Powertrain.TractionBattery.Temperature",
    "Vehicle.Powertrain.TractionBattery.StateOfCharge.Current": "Vehicle.Powertrain.TractionBattery.StateOfCharge.Current",
    "Vehicle.Body.Hood": "Vehicle.Body.Hood",
    "Vehicle.Body.Hood.IsOpen": "Vehicle.Body.Hood.IsOpen",
    "Vehicle.Body.Trunk.IsOpen": "Vehicle.Body.Trunk.IsOpen",
    "Vehicle.Body.Trunk.IsLocked": "Vehicle.Body.Trunk.IsLocked",
    "Vehicle.Body.Mirrors": "Vehicle.Body.Mirrors",
    "Vehicle.Body.Mirrors.DriverSide": "Vehicle.Body.Mirrors.Left",
    "Vehicle.Body.Mirrors.DriverSide.Tilt": "Vehicle.Body.Mirrors.Left.Tilt",
    "Vehicle.Body.Mirrors.DriverSide.Pan": "Vehicle.Body.Mirrors.Left.Pan",
    "Vehicle.Body.Mirrors.DriverSide.Heating": "Vehicle.Body.Mirrors.Left.Heating",
    "Vehicle.Body.Mirrors.DriverSide.Heating.Status": "Vehicle.Body.Mirrors.Left.Heating.Status",
    "Vehicle.Body.Mirrors.PassengerSide": "Vehicle.Body.Mirrors.Right",
    "Vehicle.Body.Mirrors.PassengerSide.Tilt": "Vehicle.Body.Mirrors.Right.Tilt",
    "Vehicle.Body.Mirrors.PassengerSide.Pan": "Vehicle.Body.Mirrors.Right.Pan",
    "Vehicle.Body.Mirrors.PassengerSide.Heating": "Vehicle.Body.Mirrors.Right.Heating",
    "Vehicle.Body.Mirrors.PassengerSide.Heating.Status": "Vehicle.Body.Mirrors.Right.Heating.Status",
    "Vehicle.Cabin.Sunroof": "Vehicle.Cabin.Sunroof",
    "Vehicle.Cabin.Sunroof.Position": "Vehicle.Cabin.Sunroof.Position",
    "Vehicle.Cabin.Sunroof.Switch": "Vehicle.Cabin.Sunroof.Switch",
    "Vehicle.Cabin.Sunroof.Shade": "Vehicle.Cabin.Sunroof.Shade",
    "Vehicle.Cabin.Sunroof.Shade.Switch": "Vehicle.Cabin.Sunroof.Shade.Switch",
    "Vehicle.Cabin.Sunroof.Shade.Position": "Vehicle.Cabin.Sunroof.Shade.Position",
    "Vehicle.Cabin.Door.Row1.DriverSide.IsOpen": "Vehicle.Cabin.Door.Row1.Left.IsOpen",
    "Vehicle.Cabin.Door.Row1.DriverSide.IsLocked": "Vehicle.Cabin.Door.Row1.Left.IsLocked",
    "Vehicle.Cabin.Door.Row1.DriverSide.Window.isOpen": "Vehicle.Cabin.Door.Row1.Left.Window.isOpen",
    "Vehicle.Cabin.Door.Row1.DriverSide.Window.Position": "Vehicle.Cabin.Door.Row1.Left.Window.Position",
    "Vehicle.Cabin.Door.Row1.DriverSide.Window.ChildLock": "Vehicle.Cabin.Door.Row1.Left.Window.ChildLock",
    "Vehicle.Cabin.Door.Row1.DriverSide.Window.Switch": "Vehicle.Cabin.Door.Row1.Left.Window.Switch",
    "Vehicle.Cabin.Door.Row1.DriverSide.IsChildLockActive": "Vehicle.Cabin.Door.Row1.Left.IsChildLockActive",
    "Vehicle.Cabin.Door.Row1.DriverSide.Shade.Switch": "Vehicle.Cabin.Door.Row1.Left.Shade.Switch",
    "Vehicle.Cabin.Door.Row1.DriverSide.Shade.Position": "Vehicle.Cabin.Door.Row1.Left.Shade.Position",
    "Vehicle.Cabin.Door.Row1.PassengerSide.IsOpen": "Vehicle.Cabin.Door.Row1.Right.IsOpen",
    "Vehicle.Cabin.Door.Row1.PassengerSide.IsLocked": "Vehicle.Cabin.Door.Row1.Right.IsLocked",
    "Vehicle.Cabin.Door.Row1.PassengerSide.Window.isOpen": "Vehicle.Cabin.Door.Row1.Right.Window.isOpen",
    "Vehicle.Cabin.Door.Row1.PassengerSide.Window.Position": "Vehicle.Cabin.Door.Row1.Right.Window.Position",
    "Vehicle.Cabin.Door.Row1.PassengerSide.Window.ChildLock": "Vehicle.Cabin.Door.Row1.Right.Window.ChildLock",
    "Vehicle.Cabin.Door.Row1.PassengerSide.Window.Switch": "Vehicle.Cabin.Door.Row1.Right.Window.Switch",
    "Vehicle.Cabin.Door.Row1.PassengerSide.IsChildLockActive": "Vehicle.Cabin.Door.Row1.Right.IsChildLockActive",
    "Vehicle.Cabin.Door.Row1.PassengerSide.Shade.Switch": "Vehicle.Cabin.Door.Row1.Right.Shade.Switch",
    "Vehicle.Cabin.Door.Row1.PassengerSide.Shade.Position": "Vehicle.Cabin.Door.Row1.Right.Shade.Position",
    "Vehicle.Cabin.Door.Row2.DriverSide.IsOpen": "Vehicle.Cabin.Door.Row2.Left.IsOpen",
    "Vehicle.Cabin.Door.Row2.DriverSide.IsLocked": "Vehicle.Cabin.Door.Row2.Left.IsLocked",
    "Vehicle.Cabin.Door.Row2.DriverSide.Window.isOpen": "Vehicle.Cabin.Door.Row2.Left.Window.isOpen",
    "Vehicle.Cabin.Door.Row2.DriverSide.Window.Position": "Vehicle.Cabin.Door.Row2.Left.Window.Position",
    "Vehicle.Cabin.Door.Row2.DriverSide.Window.ChildLock": "Vehicle.Cabin.Door.Row2.Left.Window.ChildLock",
    "Vehicle.Cabin.Door.Row2.DriverSide.Window.Switch": "Vehicle.Cabin.Door.Row2.Left.Window.Switch",
    "Vehicle.Cabin.Door.Row2.DriverSide.IsChildLockActive": "Vehicle.Cabin.Door.Row2.Left.IsChildLockActive",
    "Vehicle.Cabin.Door.Row2.DriverSide.Shade.Switch": "Vehicle.Cabin.Door.Row2.Left.Shade.Switch",
    "Vehicle.Cabin.Door.Row2.DriverSide.Shade.Position": "Vehicle.Cabin.Door.Row2.Left.Shade.Position",
    "Vehicle.Cabin.Door.Row2.PassengerSide.IsOpen": "Vehicle.Cabin.Door.Row2.Right.IsOpen",
    "Vehicle.Cabin.Door.Row2.PassengerSide.IsLocked": "Vehicle.Cabin.Door.Row2.Right.IsLocked",
    "Vehicle.Cabin.Door.Row2.PassengerSide.Window.isOpen": "Vehicle.Cabin.Door.Row2.Right.Window.isOpen",
    "Vehicle.Cabin.Door.Row2.PassengerSide.Window.Position": "Vehicle.Cabin.Door.Row2.Right.Window.Position",
    "Vehicle.Cabin.Door.Row2.PassengerSide.Window.ChildLock": "Vehicle.Cabin.Door.Row2.Right.Window.ChildLock",
    "Vehicle.Cabin.Door.Row2.PassengerSide.Window.Switch": "Vehicle.Cabin.Door.Row2.Right.Window.Switch",
    "Vehicle.Cabin.Door.Row2.PassengerSide.IsChildLockActive": "Vehicle.Cabin.Door.Row2.Right.IsChildLockActive",
    "Vehicle.Cabin.Door.Row2.PassengerSide.Shade.Switch": "Vehicle.Cabin.Door.Row2.Right.Shade.Switch",
    "Vehicle.Cabin.Door.Row2.PassengerSide.Shade.Position": "Vehicle.Cabin.Door.Row2.Right.Shade.Position"
  };

  // src/components/Page.tsx
  var import_jsx_runtime = __require("react/jsx-runtime");
  var React = globalThis.React;
  var getApiTypeClasses = (type) => {
    switch (type) {
      case "branch":
        return { bgClass: "", textClass: "text-purple-500" };
      case "actuator":
        return { bgClass: "", textClass: "text-yellow-500" };
      case "sensor":
        return { bgClass: "", textClass: "text-emerald-500" };
      case "attribute":
        return { bgClass: "", textClass: "text-sky-500" };
      case "Atomic Service":
        return { bgClass: "", textClass: "text-purple-500" };
      case "Basic Service":
        return { bgClass: "", textClass: "text-emerald-500" };
      default:
        return { bgClass: "", textClass: "text-da-gray-medium" };
    }
  };
  var logos = [
    {
      src: "https://bewebstudio.digitalauto.tech/data/projects/TQUHL1DoUNoI/digital.auto.png",
      name: "DigitalAuto",
      href: "https://www.digital-auto.org/"
    },
    {
      src: "https://bewebstudio.digitalauto.tech/data/projects/TQUHL1DoUNoI/certivity.png",
      name: "Certivity",
      href: "https://www.certivity.io/"
    },
    {
      src: "https://bewebstudio.digitalauto.tech/data/projects/TQUHL1DoUNoI/AlephAlpha.png",
      name: "Aleph Alpha",
      href: "https://aleph-alpha.com/"
    },
    {
      src: "https://bewebstudio.digitalauto.tech/data/projects/TQUHL1DoUNoI/ETAS.png",
      name: "ETAS",
      href: "https://www.etas.com/en/"
    }
  ];
  function Page({ data, config, api }) {
    const [selectedApis, setSelectedApis] = React.useState(/* @__PURE__ */ new Set());
    const [loading, setLoading] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState("");
    const [regulationRegions, setRegulationRegions] = React.useState([]);
    const getApiName = (api2) => {
      return typeof api2 === "string" ? api2 : api2.name || "";
    };
    const isApiSupported = (apiName) => {
      if (supportedCertivityApis.has(apiName)) {
        return true;
      }
      const mappedName = supportedCertivityApis_v4_map[apiName];
      return mappedName ? supportedCertivityApis.has(mappedName) : false;
    };
    const vssApis = React.useMemo(() => {
      const vssApisData = data?.prototype?.apis?.VSS || [];
      return [...vssApisData].sort((a, b) => {
        const aName = getApiName(a);
        const bName = getApiName(b);
        const aSupported = isApiSupported(aName);
        const bSupported = isApiSupported(bName);
        if (aSupported && !bSupported)
          return -1;
        if (!aSupported && bSupported)
          return 1;
        return 0;
      });
    }, [data?.prototype?.apis?.VSS]);
    const formatRegulations = (regulations) => {
      let formattedRegulations = [];
      regulations.forEach((regulation) => {
        let region = formattedRegulations.find(
          (r) => r.name === regulation.region
        );
        if (!region) {
          region = {
            name: regulation.region,
            types: []
          };
          formattedRegulations.push(region);
        }
        let type = region.types.find((t) => t.name === regulation.type);
        if (!type) {
          type = {
            name: regulation.type,
            regulations: []
          };
          region.types.push(type);
        }
        type.regulations.push({
          key: regulation.key,
          titleShort: regulation.titleShort,
          titleLong: regulation.titleLong
        });
      });
      formattedRegulations.forEach((region) => {
        region.types.forEach((type) => {
          type.regulations.sort((a, b) => {
            try {
              const aNum = parseInt(a.key.replace(/^[^0-9]+/g, ""));
              const bNum = parseInt(b.key.replace(/^[^0-9]+/g, ""));
              return aNum - bNum;
            } catch (error) {
              return a.key.localeCompare(b.key);
            }
          });
        });
      });
      return formattedRegulations;
    };
    React.useEffect(() => {
      (async () => {
        try {
          setLoading(true);
          setErrorMsg("");
          if (selectedApis.size > 0) {
            console.log("Selected APIs:", Array.from(selectedApis));
            const supportedApiNames = Array.from(selectedApis).map((apiName) => {
              const apiNameStr = apiName;
              const isDirectlySupported = supportedCertivityApis.has(apiNameStr);
              const mappedName = supportedCertivityApis_v4_map[apiNameStr];
              const result = isDirectlySupported ? apiNameStr : mappedName;
              console.log(`API: ${apiNameStr}, Directly supported: ${isDirectlySupported}, Mapped: ${mappedName}, Result: ${result}`);
              return result;
            }).filter((value) => {
              const isValid = value && supportedCertivityApis.has(value);
              console.log(`Filtering ${value}: ${isValid}`);
              return isValid;
            });
            console.log("Supported API names after filtering:", supportedApiNames);
            if (supportedApiNames.length > 0) {
              const apiUrl = `https://service.homologation.digital.auto/regulations?vehicleApis=${supportedApiNames.join(",")}`;
              console.log("Fetching regulations from:", apiUrl);
              const response = await fetch(apiUrl, {
                method: "GET",
                credentials: "include"
              });
              console.log("Response status:", response.status, response.ok);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const regulationsResponse = await response.json();
              console.log("Regulations response:", regulationsResponse);
              if (!regulationsResponse || regulationsResponse.length === 0) {
                console.log("No regulations found in response");
                setRegulationRegions([]);
              } else {
                const formatted = formatRegulations(regulationsResponse);
                console.log("Formatted regulations:", formatted);
                setRegulationRegions(formatted);
              }
            } else {
              console.log("No supported APIs found in selection");
              setRegulationRegions([]);
            }
          } else {
            console.log("No APIs selected");
            setRegulationRegions([]);
          }
        } catch (error) {
          setErrorMsg("Error fetching regulations");
          console.error("Error fetching regulations:", error);
          setRegulationRegions([]);
        } finally {
          setLoading(false);
        }
      })();
    }, [selectedApis]);
    const handleToggleApi = (apiName) => {
      setSelectedApis((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(apiName)) {
          newSet.delete(apiName);
        } else {
          newSet.add(apiName);
        }
        return newSet;
      });
    };
    const handleSelectAll = () => {
      const supportedApiNames = vssApis.map((api2) => getApiName(api2)).filter((apiName) => isApiSupported(apiName));
      const allSupportedSelected = supportedApiNames.length > 0 && supportedApiNames.every((name) => selectedApis.has(name));
      if (allSupportedSelected) {
        setSelectedApis(/* @__PURE__ */ new Set());
      } else {
        setSelectedApis(new Set(supportedApiNames));
      }
    };
    const handleClearSelection = () => {
      setSelectedApis(/* @__PURE__ */ new Set());
    };
    const getApiType = (api2) => {
      if (typeof api2 === "string")
        return "ACTUATOR";
      return api2.type || api2.datatype || "ACTUATOR";
    };
    React.useEffect(() => {
      console.log("prototype data", data?.prototype);
    }, [data?.prototype]);
    React.useEffect(() => {
      console.log("model data", data?.model);
    }, [data?.model]);
    if (!data?.prototype?.name) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        "div",
        {
          className: "h-full w-full bg-slate-200 p-2 flex text-black",
          style: {},
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-white shadow-lg rounded-lg w-full h-full flex items-start justify-start px-4 py-4 overflow-auto", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { className: "text-2xl font-bold text-slate-700", children: "No Data Found" }) })
        }
      );
    }
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: "h-full w-full bg-slate-200 p-2 flex text-black",
        style: {},
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white shadow-lg rounded-lg w-full h-full flex gap-4 px-4 py-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "w-1/2 h-full flex flex-col gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                className: "flex-1 flex flex-col rounded-lg p-2",
                style: { backgroundColor: "rgba(225, 231, 239, 0.2)" },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { className: "text-lg font-bold text-slate-700", children: [
                      "Used Signals (",
                      vssApis.length,
                      ")"
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-3", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { className: "flex items-center gap-1 text-sm cursor-pointer hover:opacity-60", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          "input",
                          {
                            type: "checkbox",
                            checked: (() => {
                              const supportedApiNames = vssApis.map((api2) => getApiName(api2)).filter((apiName) => isApiSupported(apiName));
                              return supportedApiNames.length > 0 && supportedApiNames.every((name) => selectedApis.has(name));
                            })(),
                            onChange: handleSelectAll,
                            className: "w-4 h-4 cursor-pointer"
                          }
                        ),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select all" })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                        "button",
                        {
                          onClick: handleClearSelection,
                          className: "flex items-center gap-1 text-sm cursor-pointer hover:opacity-60",
                          title: "Clear selection",
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clear selection" })
                          ]
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 overflow-auto", children: vssApis.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-sm text-slate-500 text-center py-4", children: "No signals available" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-0.5", children: vssApis.map((api2, index) => {
                    const apiName = getApiName(api2);
                    const apiType = getApiType(api2);
                    const isSelected = selectedApis.has(apiName);
                    const isSupported = isApiSupported(apiName);
                    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "div",
                      {
                        className: `flex items-center justify-between py-1 px-2 rounded ${isSupported ? "hover:bg-slate-100" : "opacity-50 cursor-not-allowed"}`,
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 flex-1 min-w-0", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              "input",
                              {
                                type: "checkbox",
                                checked: isSelected,
                                disabled: !isSupported,
                                onChange: () => isSupported && handleToggleApi(apiName),
                                className: `w-4 h-4 flex-shrink-0 ${isSupported ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`
                              }
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `text-sm truncate ${isSupported ? "text-slate-700" : "text-slate-400"}`, children: apiName })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `text-xs !font-medium uppercase select-none
                            px-2 py-1 rounded-full ${getApiTypeClasses(apiType).bgClass} ${getApiTypeClasses(apiType).textClass}`, children: apiType })
                        ]
                      },
                      index
                    );
                  }) }) })
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                className: "h-[160px] flex flex-col rounded-lg p-2",
                style: { backgroundColor: "rgba(225, 231, 239, 0.2)" },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-lg font-bold text-slate-700 mb-2", children: "Vehicle Properties" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 overflow-auto", children: data?.model?.vehicle_category && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "div",
                    {
                      className: "flex font-medium items-center gap-2",
                      style: { gap: "10px", fontSize: "14px" },
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Category: " }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-bold", children: data?.model?.vehicle_category })
                      ]
                    }
                  ) })
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                className: "h-[100px] rounded-lg p-2 flex flex-col",
                style: {},
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-center flex-shrink-0 text-xs", children: "This prototype is powered by" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    "div",
                    {
                      className: "flex w-full h-full items-center justify-center",
                      style: { gap: "20px", backgroundColor: "white" },
                      children: logos.map((logo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        "a",
                        {
                          className: "transition cursor-pointer",
                          href: logo.href,
                          target: "__blank",
                          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                            "img",
                            {
                              src: logo.src,
                              className: "w-full object-contain",
                              style: { height: "auto", maxHeight: "60px" },
                              alt: logo.name + "-logo"
                            }
                          )
                        },
                        logo.name
                      ))
                    }
                  )
                ]
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            "div",
            {
              className: "w-1/2 h-full flex flex-col overflow-auto rounded-lg p-2",
              style: { backgroundColor: "rgba(225, 231, 239, 0.2)" },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "text-lg font-bold text-slate-700 mb-2", children: "Regulation Compliance" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 overflow-auto", children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-sm text-slate-500", children: "Loading regulations..." }) }) : errorMsg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex items-center justify-center h-full italic text-slate-500", children: "<" + errorMsg + ">" }) : regulationRegions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex items-center justify-center h-full italic text-slate-500", children: selectedApis.size === 0 ? "<Please select a supported API>" : "<No regulations found for selected APIs. The selected APIs may not be supported by Certivity.>" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-7 mt-4", children: regulationRegions.map((region) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "font-bold text-lg text-slate-700 mt-5 flex items-center justify-start gap-4", children: [
                    region.name,
                    " Region"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t my-6 border-t-slate-300" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: region.types.map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-bold mt-3 text-base text-slate-700", children: type.name }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { className: "space-y-6 mt-4", children: type.regulations.map((regulation) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "li",
                      {
                        className: "mt-3 list-disc ml-4 space-y-2",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm font-bold text-slate-700", children: [
                            regulation.key,
                            ": ",
                            regulation.titleShort
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-slate-500", children: regulation.titleLong })
                        ]
                      },
                      regulation.key
                    )) })
                  ] }, type.name)) })
                ] }, region.name)) }) })
              ]
            }
          )
        ] })
      }
    );
  }

  // src/index.ts
  var components = { Page };
  function mount(el, props) {
    const root = ReactDOM.createRoot(el);
    root.render(React2.createElement(Page, props || {}));
    el.__aw_root = root;
  }
  function unmount(el) {
    const r = el.__aw_root;
    if (r && r.unmount)
      r.unmount();
    delete el.__aw_root;
  }
  if (typeof window !== "undefined") {
    ;
    window.DAPlugins = window.DAPlugins || {};
    window.DAPlugins["page-plugin"] = { components, mount, unmount };
  }
})();
//# sourceMappingURL=index.js.map
