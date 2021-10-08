import {CuraWASM} from './node_modules/cura-wasm/dist/es.js';
import {resolveDefinition} from './node_modules/cura-wasm-definitions/dist/es.js';

const main = async () =>
{
  //Create a new slicer
  const slicer = new CuraWASM({
    /**
     * Specify Cura Engine launch arguments (Identical to desktop Cura Engine).
     *
     * If you find that "-s" overrides aren't taking effect, make sure that you
     * order your arguments correctly.
     *
     * NOTE: You CANNOT specify both this setting and overrides!
     */
    command: 'slice -j definitions/printer.def.json -o Model.gcode -s layer_height=6 -l Model.stl',

    /*
     * The 3D printer definition to slice for (See the cura-wasm-definitions
     * repository or https://github.com/cloud-cnc/cura-wasm-definitions
     * for a list of built-in definitions)
     */
    definition: resolveDefinition('ultimaker2'),

    /*
     * Overrides for the current 3D printer definition (Passed to Cura Engine
     * with the -s CLI argument)
     *
     * NOTE: You CANNOT specify both this setting and launch arguments!
     */

    /**
     * Wether or not to transfer the input STL ArrayBuffer to the worker thread
     * (Prevents duplicating large amounts of memory but empties the ArrayBuffer
     * on the main thread preventing other code from using the ArrayBuffer)
     */
    transfer: true,

    /*
     * Wether to enable verbose logging (Useful for debugging; allows Cura
     * Engine to directly log to the console)
     */
    verbose: true
  });

  //Load your STL as an ArrayBuffer
  const res = await fetch('./model-1.stl');
  const stl = await res.arrayBuffer();

  //Progress logger (Ranges from 0 to 100)
  slicer.on('progress', percent =>
  {
    console.log(`Progress: ${percent}%`);
  });

  //Slice (This can take multiple minutes to resolve!)
  const {gcode, metadata} = await slicer.slice(stl, 'stl');

  console.log(gcode)
  console.log(metadata)
  window.gcode = gcode
  window.metadata = metadata

  //Do something with the GCODE (ArrayBuffer) and metadata (Object)

  //Dispose (Reccomended but not necessary to call/intended for SPAs)
  slicer.dispose();
}
main();