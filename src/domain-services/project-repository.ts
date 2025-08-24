import type { Project } from "../domain-models/entities/project";
import type { NodeId } from "../domain-models/value-objects/id-value-objects/node-id";
import type { Node } from "../domain-models/entities/node";

export interface IProjectRepository {
  /**
   * このプロジェクトのProjectエンティティを取得する
   * @exception 存在しない場合
   */
  getProject(): Promise<Project>;
  /**
   * このプロジェクトのProjectエンティティを作成または更新する
   */
  upsertProject(project: Project): Promise<void>;
  /**
   * このプロジェクトのNodeエンティティを追加する
   * @exception 既存のIDの場合
   */
  putNode(node: Node): Promise<void>;
  /**
   * このプロジェクトの全てのNodeエンティティを取得する
   * @exception スキーマと形式が合わない場合
   */
  getAllNodes(): Promise<Node[]>;
  /**
   * このプロジェクトのNodeエンティティを取得する
   * @param id 取得するNodeエンティティのID
   * @exception スキーマと形式が合わない場合
   */
  getNode(id: NodeId): Promise<Node | null>;
  /**
   * このプロジェクトのNodeエンティティを更新する
   * @param node 更新するNodeエンティティ
   * @exception 存在しない場合、スキーマと形式が合わない場合
   */
  updateNode(node: Node): Promise<void>;
  /**
   * このプロジェクトのNodeエンティティを削除する
   * @param id 削除するNodeエンティティのID
   */
  deleteNode(id: NodeId): Promise<void>;
  /**
   * このプロジェクトのNodeエンティティを更新する
   * @param func トランザクション内で実行する関数
   */
  startTransaction(func: () => Promise<void>): Promise<void>;
}
