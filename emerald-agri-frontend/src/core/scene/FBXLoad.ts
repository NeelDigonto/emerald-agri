import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { RenderEngine } from "../RenderEngine";
import { SceneGraph, SceneObject, SceneObjectType } from "../SceneGraph";
import { loadTextures } from "../TextureManager";
import { deepTraverse } from "../utils";

//import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils";

export async function loadFBX(
  scene: THREE.Scene,
  sceneGraph: SceneGraph,
  renderEngine: RenderEngine
) {
  const fbxLoader = new FBXLoader();

  const tree = await fbxLoader.loadAsync("models/tree.fbx");

  const newMat = new THREE.MeshStandardMaterial();

  await loadTextures(
    newMat,
    {
      albedo: "models/tree_albedo.jpg",
      normal: "models/tree_normal.jpg",
      roughness: "models/tree_roughness.jpg",
      ao: "models/tree_ao.jpg",
    },
    THREE.ClampToEdgeWrapping,
    1,
    1
  );

  deepTraverse(tree, async (mesh) => {
    if (!(mesh instanceof THREE.Mesh)) return;

    mesh.material.dispose();

    mesh.material = newMat;
  });

  /* tree.scale.set(0.04, 0.04, 0.04);
  tree.position.set(0, 0, 0);
  scene.add(tree);
  sceneGraph.add(
    sceneGraph.root!.id,
    new SceneObject("Base T Pose 1", tree, SceneObjectType.MeshObject, true)
  ); */

  let treeCount = 0;
  for (let x = 0; x < 300; x++)
    (async () => {
      const tree_ = tree.clone();

      tree_.scale.set(0.04, 0.04, 0.04);

      tree_.position.setY(1);
      tree_.position.setX(Math.floor(Math.random() * 100) - 50);
      tree_.position.setZ(Math.floor(Math.random() * 100) - 50);

      scene.add(tree_);
      sceneGraph.add(
        sceneGraph.root!.id,
        new SceneObject(
          `Box ${treeCount++}`,
          tree_,
          SceneObjectType.MeshObject,
          true
        )
      );
    })();
}
