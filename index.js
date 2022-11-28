import * as THREE from 'three';
// import Simplex from './simplex-noise.js';
import metaversefile from 'metaversefile';
const {useApp, useFrame, useUse, useWear, useCleanup} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

export default e => {
  const app = useApp();
  const {components} = app;

  let subApp = null;
  e.waitUntil((async () => {
    const _loadModel = async () => {
      // let u2 = baseUrl + 'megasword_v4_texta.glb';
      let u2 = baseUrl + 'plant.glb';
      /* if (/^https?:/.test(u2)) {
        u2 = '/@proxy/' + u2;
      } */
      const m = await metaversefile.import(u2);

      subApp = metaversefile.createApp({
        name: u2,
      });
      subApp.name = 'silsword mesh';
      /* subApp.position.copy(app.position);
      subApp.quaternion.copy(app.quaternion);
      subApp.scale.copy(app.scale); */
      app.add(subApp);
      subApp.updateMatrixWorld();
      subApp.contentId = u2;
      subApp.instanceId = app.instanceId;

      for (const {key, value} of components) {
        subApp.setComponent(key, value);
      }
      await subApp.addModule(m);
    };
    await Promise.all([
      _loadModel(),
    ]);
  })());

  /* useActivate(() => {
    const localPlayer = useLocalPlayer();
    localPlayer.wear(app);
  }); */

  let wearing = false;
  useWear(e => {
    const {wear} = e;
    if (subApp) {
      /* if (!wear) {
        subApp.position.copy(app.position);
        subApp.quaternion.copy(app.quaternion);
        subApp.scale.copy(app.scale);
        subApp.updateMatrixWorld();
      } */

      /* subApp.dispatchEvent({
        type: 'wearupdate',
        wear,
      }); */
    }
    wearing = !!wear;
  });

  let using = false;
  useUse(e => {
    using = e.use;
  });

  useFrame(() => {
  });

  useCleanup(() => {
    subApp && subApp.destroy();
  });

  app.getPhysicsObjects = () => subApp ? subApp.getPhysicsObjects() : [];

  return app;
};
