/**
 * Client
 **/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model Cattle
 *
 */
export type Cattle = $Result.DefaultSelection<Prisma.$CattlePayload>;
/**
 * Model Customer
 *
 */
export type Customer = $Result.DefaultSelection<Prisma.$CustomerPayload>;
/**
 * Model Transaction
 *
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>;
/**
 * Model TransactionItem
 *
 */
export type TransactionItem =
  $Result.DefaultSelection<Prisma.$TransactionItemPayload>;

/**
 * Enums
 */
export namespace $Enums {
  export const CattleClass: {
    GOLD: 'GOLD';
    SILVER: 'SILVER';
    PLATINUM: 'PLATINUM';
  };

  export type CattleClass = (typeof CattleClass)[keyof typeof CattleClass];

  export const HealthStatus: {
    HEALTHY: 'HEALTHY';
    SICK: 'SICK';
    DEAD: 'DEAD';
  };

  export type HealthStatus = (typeof HealthStatus)[keyof typeof HealthStatus];

  export const Gender: {
    MALE: 'MALE';
    FEMALE: 'FEMALE';
  };

  export type Gender = (typeof Gender)[keyof typeof Gender];

  export const PaymentStatus: {
    PENDING: 'PENDING';
    PAID: 'PAID';
    PARTIALLY_PAID: 'PARTIALLY_PAID';
  };

  export type PaymentStatus =
    (typeof PaymentStatus)[keyof typeof PaymentStatus];

  export const PaymentMethod: {
    CASH: 'CASH';
    BANK_TRANSFER: 'BANK_TRANSFER';
    MOBILE_MONEY: 'MOBILE_MONEY';
  };

  export type PaymentMethod =
    (typeof PaymentMethod)[keyof typeof PaymentMethod];
}

export type CattleClass = $Enums.CattleClass;

export const CattleClass: typeof $Enums.CattleClass;

export type HealthStatus = $Enums.HealthStatus;

export const HealthStatus: typeof $Enums.HealthStatus;

export type Gender = $Enums.Gender;

export const Gender: typeof $Enums.Gender;

export type PaymentStatus = $Enums.PaymentStatus;

export const PaymentStatus: typeof $Enums.PaymentStatus;

export type PaymentMethod = $Enums.PaymentMethod;

export const PaymentMethod: typeof $Enums.PaymentMethod;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Cattles
 * const cattles = await prisma.cattle.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Cattles
   * const cattles = await prisma.cattle.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(
    optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>
  );
  $on<V extends U>(
    eventType: V,
    callback: (
      event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent
    ) => void
  ): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void;

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(
    query: TemplateStringsArray | Prisma.Sql,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(
    query: string,
    ...values: any[]
  ): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel }
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

  $transaction<R>(
    fn: (
      prisma: Omit<PrismaClient, runtime.ITXClientDenyList>
    ) => $Utils.JsPromise<R>,
    options?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    }
  ): $Utils.JsPromise<R>;

  $extends: $Extensions.ExtendsHook<
    'extends',
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs;
      }
    >
  >;

  /**
   * `prisma.cattle`: Exposes CRUD operations for the **Cattle** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Cattles
   * const cattles = await prisma.cattle.findMany()
   * ```
   */
  get cattle(): Prisma.CattleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Customers
   * const customers = await prisma.customer.findMany()
   * ```
   */
  get customer(): Prisma.CustomerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more Transactions
   * const transactions = await prisma.transaction.findMany()
   * ```
   */
  get transaction(): Prisma.TransactionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transactionItem`: Exposes CRUD operations for the **TransactionItem** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more TransactionItems
   * const transactionItems = await prisma.transactionItem.findMany()
   * ```
   */
  get transactionItem(): Prisma.TransactionItemDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF;

  export type PrismaPromise<T> = $Public.PrismaPromise<T>;

  /**
   * Validator
   */
  export import validator = runtime.Public.validator;

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
  export import PrismaClientValidationError = runtime.PrismaClientValidationError;

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag;
  export import empty = runtime.empty;
  export import join = runtime.join;
  export import raw = runtime.raw;
  export import Sql = runtime.Sql;

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal;

  export type DecimalJsLike = runtime.DecimalJsLike;

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics;
  export type Metric<T> = runtime.Metric<T>;
  export type MetricHistogram = runtime.MetricHistogram;
  export type MetricHistogramBucket = runtime.MetricHistogramBucket;

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs;
  export import getExtensionContext = runtime.Extensions.getExtensionContext;
  export import Args = $Public.Args;
  export import Payload = $Public.Payload;
  export import Result = $Public.Result;
  export import Exact = $Public.Exact;

  /**
   * Prisma Client JS version: 6.8.2
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
   */
  export type PrismaVersion = {
    client: string;
  };

  export const prismaVersion: PrismaVersion;

  /**
   * Utility Types
   */

  export import JsonObject = runtime.JsonObject;
  export import JsonArray = runtime.JsonArray;
  export import JsonValue = runtime.JsonValue;
  export import InputJsonObject = runtime.InputJsonObject;
  export import InputJsonArray = runtime.InputJsonArray;
  export import InputJsonValue = runtime.InputJsonValue;

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never;
      private constructor();
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never;
      private constructor();
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull;

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull;

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull;

  type SelectAndInclude = {
    select: any;
    include: any;
  };

  type SelectAndOmit = {
    select: any;
    omit: any;
  };

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> =
    T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<
    T extends (...args: any) => $Utils.JsPromise<any>
  > = PromiseType<ReturnType<T>>;

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };

  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
  }[keyof T];

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
  };

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {});

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  } & K;

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object
    ? U extends object
      ? (Without<T, U> & U) | (Without<U, T> & T)
      : U
    : T;

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False;

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
    }[K];

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<
    __Either<O, K>
  >;

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
  }[strict];

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never;

  export type Union = any;

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
  } & {};

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never;

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>;
      }
    >
  >;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O
    ? O[K]
    : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown
    ? AtStrict<O, K>
    : never;
  export type At<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K];
      } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ?
          | (K extends keyof O ? { [P in K]: O[P] } & O : O)
          | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >;

  type _Strict<U, _U = U> = U extends unknown
    ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
    : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False;

  // /**
  // 1
  // */
  export type True = 1;

  /**
  0
  */
  export type False = 0;

  export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
  }[B];

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0;

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >;

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0;
      1: 1;
    };
    1: {
      0: 1;
      1: 1;
    };
  }[B1][B2];

  export type Keys<U extends Union> = U extends unknown ? keyof U : never;

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never;
      }
    : never;

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T;

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<
            UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never
          >
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K;
  }[keyof T];

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<
    T,
    K extends Enumerable<keyof T> | keyof T
  > = Prisma__Pick<T, MaybeTupleToUnion<K>>;

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
    ? never
    : T;

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

  type FieldRefInputType<Model, FieldType> = Model extends never
    ? never
    : FieldRef<Model, FieldType>;

  export const ModelName: {
    Cattle: 'Cattle';
    Customer: 'Customer';
    Transaction: 'Transaction';
    TransactionItem: 'TransactionItem';
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName];

  export type Datasources = {
    db?: Datasource;
  };

  interface TypeMapCb<ClientOptions = {}>
    extends $Utils.Fn<
      { extArgs: $Extensions.InternalArgs },
      $Utils.Record<string, any>
    > {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >;
  }

  export type TypeMap<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > = {
    globalOmitOptions: {
      omit: GlobalOmitOptions;
    };
    meta: {
      modelProps: 'cattle' | 'customer' | 'transaction' | 'transactionItem';
      txIsolationLevel: Prisma.TransactionIsolationLevel;
    };
    model: {
      Cattle: {
        payload: Prisma.$CattlePayload<ExtArgs>;
        fields: Prisma.CattleFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.CattleFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CattlePayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.CattleFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CattlePayload>;
          };
          findFirst: {
            args: Prisma.CattleFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CattlePayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.CattleFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CattlePayload>;
          };
          findMany: {
            args: Prisma.CattleFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CattlePayload>[];
          };
          create: {
            args: Prisma.CattleCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CattlePayload>;
          };
          createMany: {
            args: Prisma.CattleCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.CattleCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CattlePayload>[];
          };
          delete: {
            args: Prisma.CattleDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CattlePayload>;
          };
          update: {
            args: Prisma.CattleUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CattlePayload>;
          };
          deleteMany: {
            args: Prisma.CattleDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.CattleUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.CattleUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CattlePayload>[];
          };
          upsert: {
            args: Prisma.CattleUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CattlePayload>;
          };
          aggregate: {
            args: Prisma.CattleAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateCattle>;
          };
          groupBy: {
            args: Prisma.CattleGroupByArgs<ExtArgs>;
            result: $Utils.Optional<CattleGroupByOutputType>[];
          };
          count: {
            args: Prisma.CattleCountArgs<ExtArgs>;
            result: $Utils.Optional<CattleCountAggregateOutputType> | number;
          };
        };
      };
      Customer: {
        payload: Prisma.$CustomerPayload<ExtArgs>;
        fields: Prisma.CustomerFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.CustomerFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>;
          };
          findFirst: {
            args: Prisma.CustomerFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>;
          };
          findMany: {
            args: Prisma.CustomerFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[];
          };
          create: {
            args: Prisma.CustomerCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>;
          };
          createMany: {
            args: Prisma.CustomerCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[];
          };
          delete: {
            args: Prisma.CustomerDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>;
          };
          update: {
            args: Prisma.CustomerUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>;
          };
          deleteMany: {
            args: Prisma.CustomerDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.CustomerUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.CustomerUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[];
          };
          upsert: {
            args: Prisma.CustomerUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>;
          };
          aggregate: {
            args: Prisma.CustomerAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateCustomer>;
          };
          groupBy: {
            args: Prisma.CustomerGroupByArgs<ExtArgs>;
            result: $Utils.Optional<CustomerGroupByOutputType>[];
          };
          count: {
            args: Prisma.CustomerCountArgs<ExtArgs>;
            result: $Utils.Optional<CustomerCountAggregateOutputType> | number;
          };
        };
      };
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>;
        fields: Prisma.TransactionFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
          };
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
          };
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[];
          };
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
          };
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[];
          };
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
          };
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
          };
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.TransactionUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[];
          };
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>;
          };
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateTransaction>;
          };
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>;
            result: $Utils.Optional<TransactionGroupByOutputType>[];
          };
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<TransactionCountAggregateOutputType>
              | number;
          };
        };
      };
      TransactionItem: {
        payload: Prisma.$TransactionItemPayload<ExtArgs>;
        fields: Prisma.TransactionItemFieldRefs;
        operations: {
          findUnique: {
            args: Prisma.TransactionItemFindUniqueArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionItemPayload> | null;
          };
          findUniqueOrThrow: {
            args: Prisma.TransactionItemFindUniqueOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionItemPayload>;
          };
          findFirst: {
            args: Prisma.TransactionItemFindFirstArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionItemPayload> | null;
          };
          findFirstOrThrow: {
            args: Prisma.TransactionItemFindFirstOrThrowArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionItemPayload>;
          };
          findMany: {
            args: Prisma.TransactionItemFindManyArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionItemPayload>[];
          };
          create: {
            args: Prisma.TransactionItemCreateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionItemPayload>;
          };
          createMany: {
            args: Prisma.TransactionItemCreateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          createManyAndReturn: {
            args: Prisma.TransactionItemCreateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionItemPayload>[];
          };
          delete: {
            args: Prisma.TransactionItemDeleteArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionItemPayload>;
          };
          update: {
            args: Prisma.TransactionItemUpdateArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionItemPayload>;
          };
          deleteMany: {
            args: Prisma.TransactionItemDeleteManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateMany: {
            args: Prisma.TransactionItemUpdateManyArgs<ExtArgs>;
            result: BatchPayload;
          };
          updateManyAndReturn: {
            args: Prisma.TransactionItemUpdateManyAndReturnArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionItemPayload>[];
          };
          upsert: {
            args: Prisma.TransactionItemUpsertArgs<ExtArgs>;
            result: $Utils.PayloadToResult<Prisma.$TransactionItemPayload>;
          };
          aggregate: {
            args: Prisma.TransactionItemAggregateArgs<ExtArgs>;
            result: $Utils.Optional<AggregateTransactionItem>;
          };
          groupBy: {
            args: Prisma.TransactionItemGroupByArgs<ExtArgs>;
            result: $Utils.Optional<TransactionItemGroupByOutputType>[];
          };
          count: {
            args: Prisma.TransactionItemCountArgs<ExtArgs>;
            result:
              | $Utils.Optional<TransactionItemCountAggregateOutputType>
              | number;
          };
        };
      };
    };
  } & {
    other: {
      payload: any;
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]];
          result: any;
        };
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]];
          result: any;
        };
      };
    };
  };
  export const defineExtension: $Extensions.ExtendsHook<
    'define',
    Prisma.TypeMapCb,
    $Extensions.DefaultArgs
  >;
  export type DefaultPrismaClient = PrismaClient;
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources;
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string;
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    };
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null;
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig;
  }
  export type GlobalOmitConfig = {
    cattle?: CattleOmit;
    customer?: CustomerOmit;
    transaction?: TransactionOmit;
    transactionItem?: TransactionItemOmit;
  };

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error';
  export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
  };

  export type GetLogType<T extends LogLevel | LogDefinition> =
    T extends LogDefinition
      ? T['emit'] extends 'event'
        ? T['level']
        : never
      : never;
  export type GetEvents<T extends any> =
    T extends Array<LogLevel | LogDefinition>
      ?
          | GetLogType<T[0]>
          | GetLogType<T[1]>
          | GetLogType<T[2]>
          | GetLogType<T[3]>
      : never;

  export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
  };

  export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
  };
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy';

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName;
    action: PrismaAction;
    args: any;
    dataPath: string[];
    runInTransaction: boolean;
  };

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>
  ) => $Utils.JsPromise<T>;

  // tested in getLogLevel.test.ts
  export function getLogLevel(
    log: Array<LogLevel | LogDefinition>
  ): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<
    Prisma.DefaultPrismaClient,
    runtime.ITXClientDenyList
  >;

  export type Datasource = {
    url?: string;
  };

  /**
   * Count Types
   */

  /**
   * Count Type CattleCountOutputType
   */

  export type CattleCountOutputType = {
    transactionItems: number;
  };

  export type CattleCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    transactionItems?: boolean | CattleCountOutputTypeCountTransactionItemsArgs;
  };

  // Custom InputTypes
  /**
   * CattleCountOutputType without action
   */
  export type CattleCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the CattleCountOutputType
     */
    select?: CattleCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * CattleCountOutputType without action
   */
  export type CattleCountOutputTypeCountTransactionItemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: TransactionItemWhereInput;
  };

  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    transactions: number;
  };

  export type CustomerCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    transactions?: boolean | CustomerCountOutputTypeCountTransactionsArgs;
  };

  // Custom InputTypes
  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the CustomerCountOutputType
     */
    select?: CustomerCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountTransactionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: TransactionWhereInput;
  };

  /**
   * Count Type TransactionCountOutputType
   */

  export type TransactionCountOutputType = {
    transactionItems: number;
  };

  export type TransactionCountOutputTypeSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    transactionItems?:
      | boolean
      | TransactionCountOutputTypeCountTransactionItemsArgs;
  };

  // Custom InputTypes
  /**
   * TransactionCountOutputType without action
   */
  export type TransactionCountOutputTypeDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the TransactionCountOutputType
     */
    select?: TransactionCountOutputTypeSelect<ExtArgs> | null;
  };

  /**
   * TransactionCountOutputType without action
   */
  export type TransactionCountOutputTypeCountTransactionItemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: TransactionItemWhereInput;
  };

  /**
   * Models
   */

  /**
   * Model Cattle
   */

  export type AggregateCattle = {
    _count: CattleCountAggregateOutputType | null;
    _avg: CattleAvgAggregateOutputType | null;
    _sum: CattleSumAggregateOutputType | null;
    _min: CattleMinAggregateOutputType | null;
    _max: CattleMaxAggregateOutputType | null;
  };

  export type CattleAvgAggregateOutputType = {
    cattleNumber: number | null;
    liveWeight: number | null;
    meatPercentage: Decimal | null;
    fatPercentage: Decimal | null;
    purchasePricePerKg: number | null;
  };

  export type CattleSumAggregateOutputType = {
    cattleNumber: number | null;
    liveWeight: number | null;
    meatPercentage: Decimal | null;
    fatPercentage: Decimal | null;
    purchasePricePerKg: number | null;
  };

  export type CattleMinAggregateOutputType = {
    id: string | null;
    cattleNumber: number | null;
    name: string | null;
    gender: $Enums.Gender | null;
    liveWeight: number | null;
    meatPercentage: Decimal | null;
    fatPercentage: Decimal | null;
    purchasePricePerKg: number | null;
    cattleClass: $Enums.CattleClass | null;
    imageUrl: string | null;
    isSold: boolean | null;
    isQuarantined: boolean | null;
    isPregnant: boolean | null;
    isLactating: boolean | null;
    isInseminated: boolean | null;
    healthStatus: $Enums.HealthStatus | null;
    healthNotes: string | null;
    isVaccinated: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type CattleMaxAggregateOutputType = {
    id: string | null;
    cattleNumber: number | null;
    name: string | null;
    gender: $Enums.Gender | null;
    liveWeight: number | null;
    meatPercentage: Decimal | null;
    fatPercentage: Decimal | null;
    purchasePricePerKg: number | null;
    cattleClass: $Enums.CattleClass | null;
    imageUrl: string | null;
    isSold: boolean | null;
    isQuarantined: boolean | null;
    isPregnant: boolean | null;
    isLactating: boolean | null;
    isInseminated: boolean | null;
    healthStatus: $Enums.HealthStatus | null;
    healthNotes: string | null;
    isVaccinated: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type CattleCountAggregateOutputType = {
    id: number;
    cattleNumber: number;
    name: number;
    gender: number;
    liveWeight: number;
    meatPercentage: number;
    fatPercentage: number;
    purchasePricePerKg: number;
    cattleClass: number;
    imageUrl: number;
    isSold: number;
    isQuarantined: number;
    isPregnant: number;
    isLactating: number;
    isInseminated: number;
    healthStatus: number;
    healthNotes: number;
    isVaccinated: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type CattleAvgAggregateInputType = {
    cattleNumber?: true;
    liveWeight?: true;
    meatPercentage?: true;
    fatPercentage?: true;
    purchasePricePerKg?: true;
  };

  export type CattleSumAggregateInputType = {
    cattleNumber?: true;
    liveWeight?: true;
    meatPercentage?: true;
    fatPercentage?: true;
    purchasePricePerKg?: true;
  };

  export type CattleMinAggregateInputType = {
    id?: true;
    cattleNumber?: true;
    name?: true;
    gender?: true;
    liveWeight?: true;
    meatPercentage?: true;
    fatPercentage?: true;
    purchasePricePerKg?: true;
    cattleClass?: true;
    imageUrl?: true;
    isSold?: true;
    isQuarantined?: true;
    isPregnant?: true;
    isLactating?: true;
    isInseminated?: true;
    healthStatus?: true;
    healthNotes?: true;
    isVaccinated?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type CattleMaxAggregateInputType = {
    id?: true;
    cattleNumber?: true;
    name?: true;
    gender?: true;
    liveWeight?: true;
    meatPercentage?: true;
    fatPercentage?: true;
    purchasePricePerKg?: true;
    cattleClass?: true;
    imageUrl?: true;
    isSold?: true;
    isQuarantined?: true;
    isPregnant?: true;
    isLactating?: true;
    isInseminated?: true;
    healthStatus?: true;
    healthNotes?: true;
    isVaccinated?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type CattleCountAggregateInputType = {
    id?: true;
    cattleNumber?: true;
    name?: true;
    gender?: true;
    liveWeight?: true;
    meatPercentage?: true;
    fatPercentage?: true;
    purchasePricePerKg?: true;
    cattleClass?: true;
    imageUrl?: true;
    isSold?: true;
    isQuarantined?: true;
    isPregnant?: true;
    isLactating?: true;
    isInseminated?: true;
    healthStatus?: true;
    healthNotes?: true;
    isVaccinated?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type CattleAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Filter which Cattle to aggregate.
     */
    where?: CattleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Cattles to fetch.
     */
    orderBy?: CattleOrderByWithRelationInput | CattleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: CattleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Cattles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Cattles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Cattles
     **/
    _count?: true | CattleCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: CattleAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: CattleSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: CattleMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: CattleMaxAggregateInputType;
  };

  export type GetCattleAggregateType<T extends CattleAggregateArgs> = {
    [P in keyof T & keyof AggregateCattle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCattle[P]>
      : GetScalarType<T[P], AggregateCattle[P]>;
  };

  export type CattleGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: CattleWhereInput;
    orderBy?:
      | CattleOrderByWithAggregationInput
      | CattleOrderByWithAggregationInput[];
    by: CattleScalarFieldEnum[] | CattleScalarFieldEnum;
    having?: CattleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CattleCountAggregateInputType | true;
    _avg?: CattleAvgAggregateInputType;
    _sum?: CattleSumAggregateInputType;
    _min?: CattleMinAggregateInputType;
    _max?: CattleMaxAggregateInputType;
  };

  export type CattleGroupByOutputType = {
    id: string;
    cattleNumber: number;
    name: string | null;
    gender: $Enums.Gender;
    liveWeight: number;
    meatPercentage: Decimal;
    fatPercentage: Decimal;
    purchasePricePerKg: number;
    cattleClass: $Enums.CattleClass;
    imageUrl: string | null;
    isSold: boolean;
    isQuarantined: boolean;
    isPregnant: boolean;
    isLactating: boolean;
    isInseminated: boolean;
    healthStatus: $Enums.HealthStatus;
    healthNotes: string | null;
    isVaccinated: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: CattleCountAggregateOutputType | null;
    _avg: CattleAvgAggregateOutputType | null;
    _sum: CattleSumAggregateOutputType | null;
    _min: CattleMinAggregateOutputType | null;
    _max: CattleMaxAggregateOutputType | null;
  };

  type GetCattleGroupByPayload<T extends CattleGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<CattleGroupByOutputType, T['by']> & {
          [P in keyof T & keyof CattleGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CattleGroupByOutputType[P]>
            : GetScalarType<T[P], CattleGroupByOutputType[P]>;
        }
      >
    >;

  export type CattleSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      cattleNumber?: boolean;
      name?: boolean;
      gender?: boolean;
      liveWeight?: boolean;
      meatPercentage?: boolean;
      fatPercentage?: boolean;
      purchasePricePerKg?: boolean;
      cattleClass?: boolean;
      imageUrl?: boolean;
      isSold?: boolean;
      isQuarantined?: boolean;
      isPregnant?: boolean;
      isLactating?: boolean;
      isInseminated?: boolean;
      healthStatus?: boolean;
      healthNotes?: boolean;
      isVaccinated?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      transactionItems?: boolean | Cattle$transactionItemsArgs<ExtArgs>;
      _count?: boolean | CattleCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['cattle']
  >;

  export type CattleSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      cattleNumber?: boolean;
      name?: boolean;
      gender?: boolean;
      liveWeight?: boolean;
      meatPercentage?: boolean;
      fatPercentage?: boolean;
      purchasePricePerKg?: boolean;
      cattleClass?: boolean;
      imageUrl?: boolean;
      isSold?: boolean;
      isQuarantined?: boolean;
      isPregnant?: boolean;
      isLactating?: boolean;
      isInseminated?: boolean;
      healthStatus?: boolean;
      healthNotes?: boolean;
      isVaccinated?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['cattle']
  >;

  export type CattleSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      cattleNumber?: boolean;
      name?: boolean;
      gender?: boolean;
      liveWeight?: boolean;
      meatPercentage?: boolean;
      fatPercentage?: boolean;
      purchasePricePerKg?: boolean;
      cattleClass?: boolean;
      imageUrl?: boolean;
      isSold?: boolean;
      isQuarantined?: boolean;
      isPregnant?: boolean;
      isLactating?: boolean;
      isInseminated?: boolean;
      healthStatus?: boolean;
      healthNotes?: boolean;
      isVaccinated?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['cattle']
  >;

  export type CattleSelectScalar = {
    id?: boolean;
    cattleNumber?: boolean;
    name?: boolean;
    gender?: boolean;
    liveWeight?: boolean;
    meatPercentage?: boolean;
    fatPercentage?: boolean;
    purchasePricePerKg?: boolean;
    cattleClass?: boolean;
    imageUrl?: boolean;
    isSold?: boolean;
    isQuarantined?: boolean;
    isPregnant?: boolean;
    isLactating?: boolean;
    isInseminated?: boolean;
    healthStatus?: boolean;
    healthNotes?: boolean;
    isVaccinated?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type CattleOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    | 'id'
    | 'cattleNumber'
    | 'name'
    | 'gender'
    | 'liveWeight'
    | 'meatPercentage'
    | 'fatPercentage'
    | 'purchasePricePerKg'
    | 'cattleClass'
    | 'imageUrl'
    | 'isSold'
    | 'isQuarantined'
    | 'isPregnant'
    | 'isLactating'
    | 'isInseminated'
    | 'healthStatus'
    | 'healthNotes'
    | 'isVaccinated'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['cattle']
  >;
  export type CattleInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    transactionItems?: boolean | Cattle$transactionItemsArgs<ExtArgs>;
    _count?: boolean | CattleCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type CattleIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {};
  export type CattleIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {};

  export type $CattlePayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'Cattle';
    objects: {
      transactionItems: Prisma.$TransactionItemPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        cattleNumber: number;
        name: string | null;
        gender: $Enums.Gender;
        liveWeight: number;
        meatPercentage: Prisma.Decimal;
        fatPercentage: Prisma.Decimal;
        purchasePricePerKg: number;
        cattleClass: $Enums.CattleClass;
        imageUrl: string | null;
        isSold: boolean;
        isQuarantined: boolean;
        isPregnant: boolean;
        isLactating: boolean;
        isInseminated: boolean;
        healthStatus: $Enums.HealthStatus;
        healthNotes: string | null;
        isVaccinated: boolean;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['cattle']
    >;
    composites: {};
  };

  type CattleGetPayload<
    S extends boolean | null | undefined | CattleDefaultArgs
  > = $Result.GetResult<Prisma.$CattlePayload, S>;

  type CattleCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<CattleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CattleCountAggregateInputType | true;
  };

  export interface CattleDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Cattle'];
      meta: { name: 'Cattle' };
    };
    /**
     * Find zero or one Cattle that matches the filter.
     * @param {CattleFindUniqueArgs} args - Arguments to find a Cattle
     * @example
     * // Get one Cattle
     * const cattle = await prisma.cattle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CattleFindUniqueArgs>(
      args: SelectSubset<T, CattleFindUniqueArgs<ExtArgs>>
    ): Prisma__CattleClient<
      $Result.GetResult<
        Prisma.$CattlePayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Cattle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CattleFindUniqueOrThrowArgs} args - Arguments to find a Cattle
     * @example
     * // Get one Cattle
     * const cattle = await prisma.cattle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CattleFindUniqueOrThrowArgs>(
      args: SelectSubset<T, CattleFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__CattleClient<
      $Result.GetResult<
        Prisma.$CattlePayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Cattle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CattleFindFirstArgs} args - Arguments to find a Cattle
     * @example
     * // Get one Cattle
     * const cattle = await prisma.cattle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CattleFindFirstArgs>(
      args?: SelectSubset<T, CattleFindFirstArgs<ExtArgs>>
    ): Prisma__CattleClient<
      $Result.GetResult<
        Prisma.$CattlePayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Cattle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CattleFindFirstOrThrowArgs} args - Arguments to find a Cattle
     * @example
     * // Get one Cattle
     * const cattle = await prisma.cattle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CattleFindFirstOrThrowArgs>(
      args?: SelectSubset<T, CattleFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__CattleClient<
      $Result.GetResult<
        Prisma.$CattlePayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Cattles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CattleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cattles
     * const cattles = await prisma.cattle.findMany()
     *
     * // Get first 10 Cattles
     * const cattles = await prisma.cattle.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const cattleWithIdOnly = await prisma.cattle.findMany({ select: { id: true } })
     *
     */
    findMany<T extends CattleFindManyArgs>(
      args?: SelectSubset<T, CattleFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CattlePayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Cattle.
     * @param {CattleCreateArgs} args - Arguments to create a Cattle.
     * @example
     * // Create one Cattle
     * const Cattle = await prisma.cattle.create({
     *   data: {
     *     // ... data to create a Cattle
     *   }
     * })
     *
     */
    create<T extends CattleCreateArgs>(
      args: SelectSubset<T, CattleCreateArgs<ExtArgs>>
    ): Prisma__CattleClient<
      $Result.GetResult<
        Prisma.$CattlePayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Cattles.
     * @param {CattleCreateManyArgs} args - Arguments to create many Cattles.
     * @example
     * // Create many Cattles
     * const cattle = await prisma.cattle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends CattleCreateManyArgs>(
      args?: SelectSubset<T, CattleCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Cattles and returns the data saved in the database.
     * @param {CattleCreateManyAndReturnArgs} args - Arguments to create many Cattles.
     * @example
     * // Create many Cattles
     * const cattle = await prisma.cattle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Cattles and only return the `id`
     * const cattleWithIdOnly = await prisma.cattle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends CattleCreateManyAndReturnArgs>(
      args?: SelectSubset<T, CattleCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CattlePayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Cattle.
     * @param {CattleDeleteArgs} args - Arguments to delete one Cattle.
     * @example
     * // Delete one Cattle
     * const Cattle = await prisma.cattle.delete({
     *   where: {
     *     // ... filter to delete one Cattle
     *   }
     * })
     *
     */
    delete<T extends CattleDeleteArgs>(
      args: SelectSubset<T, CattleDeleteArgs<ExtArgs>>
    ): Prisma__CattleClient<
      $Result.GetResult<
        Prisma.$CattlePayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Cattle.
     * @param {CattleUpdateArgs} args - Arguments to update one Cattle.
     * @example
     * // Update one Cattle
     * const cattle = await prisma.cattle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends CattleUpdateArgs>(
      args: SelectSubset<T, CattleUpdateArgs<ExtArgs>>
    ): Prisma__CattleClient<
      $Result.GetResult<
        Prisma.$CattlePayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Cattles.
     * @param {CattleDeleteManyArgs} args - Arguments to filter Cattles to delete.
     * @example
     * // Delete a few Cattles
     * const { count } = await prisma.cattle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends CattleDeleteManyArgs>(
      args?: SelectSubset<T, CattleDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Cattles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CattleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cattles
     * const cattle = await prisma.cattle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends CattleUpdateManyArgs>(
      args: SelectSubset<T, CattleUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Cattles and returns the data updated in the database.
     * @param {CattleUpdateManyAndReturnArgs} args - Arguments to update many Cattles.
     * @example
     * // Update many Cattles
     * const cattle = await prisma.cattle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Cattles and only return the `id`
     * const cattleWithIdOnly = await prisma.cattle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends CattleUpdateManyAndReturnArgs>(
      args: SelectSubset<T, CattleUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CattlePayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Cattle.
     * @param {CattleUpsertArgs} args - Arguments to update or create a Cattle.
     * @example
     * // Update or create a Cattle
     * const cattle = await prisma.cattle.upsert({
     *   create: {
     *     // ... data to create a Cattle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cattle we want to update
     *   }
     * })
     */
    upsert<T extends CattleUpsertArgs>(
      args: SelectSubset<T, CattleUpsertArgs<ExtArgs>>
    ): Prisma__CattleClient<
      $Result.GetResult<
        Prisma.$CattlePayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Cattles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CattleCountArgs} args - Arguments to filter Cattles to count.
     * @example
     * // Count the number of Cattles
     * const count = await prisma.cattle.count({
     *   where: {
     *     // ... the filter for the Cattles we want to count
     *   }
     * })
     **/
    count<T extends CattleCountArgs>(
      args?: Subset<T, CattleCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CattleCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Cattle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CattleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends CattleAggregateArgs>(
      args: Subset<T, CattleAggregateArgs>
    ): Prisma.PrismaPromise<GetCattleAggregateType<T>>;

    /**
     * Group by Cattle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CattleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends CattleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CattleGroupByArgs['orderBy'] }
        : { orderBy?: CattleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, CattleGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetCattleGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Cattle model
     */
    readonly fields: CattleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cattle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CattleClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    transactionItems<T extends Cattle$transactionItemsArgs<ExtArgs> = {}>(
      args?: Subset<T, Cattle$transactionItemsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$TransactionItemPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Cattle model
   */
  interface CattleFieldRefs {
    readonly id: FieldRef<'Cattle', 'String'>;
    readonly cattleNumber: FieldRef<'Cattle', 'Int'>;
    readonly name: FieldRef<'Cattle', 'String'>;
    readonly gender: FieldRef<'Cattle', 'Gender'>;
    readonly liveWeight: FieldRef<'Cattle', 'Int'>;
    readonly meatPercentage: FieldRef<'Cattle', 'Decimal'>;
    readonly fatPercentage: FieldRef<'Cattle', 'Decimal'>;
    readonly purchasePricePerKg: FieldRef<'Cattle', 'Int'>;
    readonly cattleClass: FieldRef<'Cattle', 'CattleClass'>;
    readonly imageUrl: FieldRef<'Cattle', 'String'>;
    readonly isSold: FieldRef<'Cattle', 'Boolean'>;
    readonly isQuarantined: FieldRef<'Cattle', 'Boolean'>;
    readonly isPregnant: FieldRef<'Cattle', 'Boolean'>;
    readonly isLactating: FieldRef<'Cattle', 'Boolean'>;
    readonly isInseminated: FieldRef<'Cattle', 'Boolean'>;
    readonly healthStatus: FieldRef<'Cattle', 'HealthStatus'>;
    readonly healthNotes: FieldRef<'Cattle', 'String'>;
    readonly isVaccinated: FieldRef<'Cattle', 'Boolean'>;
    readonly createdAt: FieldRef<'Cattle', 'DateTime'>;
    readonly updatedAt: FieldRef<'Cattle', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Cattle findUnique
   */
  export type CattleFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Cattle
     */
    select?: CattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Cattle
     */
    omit?: CattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CattleInclude<ExtArgs> | null;
    /**
     * Filter, which Cattle to fetch.
     */
    where: CattleWhereUniqueInput;
  };

  /**
   * Cattle findUniqueOrThrow
   */
  export type CattleFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Cattle
     */
    select?: CattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Cattle
     */
    omit?: CattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CattleInclude<ExtArgs> | null;
    /**
     * Filter, which Cattle to fetch.
     */
    where: CattleWhereUniqueInput;
  };

  /**
   * Cattle findFirst
   */
  export type CattleFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Cattle
     */
    select?: CattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Cattle
     */
    omit?: CattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CattleInclude<ExtArgs> | null;
    /**
     * Filter, which Cattle to fetch.
     */
    where?: CattleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Cattles to fetch.
     */
    orderBy?: CattleOrderByWithRelationInput | CattleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Cattles.
     */
    cursor?: CattleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Cattles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Cattles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Cattles.
     */
    distinct?: CattleScalarFieldEnum | CattleScalarFieldEnum[];
  };

  /**
   * Cattle findFirstOrThrow
   */
  export type CattleFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Cattle
     */
    select?: CattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Cattle
     */
    omit?: CattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CattleInclude<ExtArgs> | null;
    /**
     * Filter, which Cattle to fetch.
     */
    where?: CattleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Cattles to fetch.
     */
    orderBy?: CattleOrderByWithRelationInput | CattleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Cattles.
     */
    cursor?: CattleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Cattles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Cattles.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Cattles.
     */
    distinct?: CattleScalarFieldEnum | CattleScalarFieldEnum[];
  };

  /**
   * Cattle findMany
   */
  export type CattleFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Cattle
     */
    select?: CattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Cattle
     */
    omit?: CattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CattleInclude<ExtArgs> | null;
    /**
     * Filter, which Cattles to fetch.
     */
    where?: CattleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Cattles to fetch.
     */
    orderBy?: CattleOrderByWithRelationInput | CattleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Cattles.
     */
    cursor?: CattleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Cattles from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Cattles.
     */
    skip?: number;
    distinct?: CattleScalarFieldEnum | CattleScalarFieldEnum[];
  };

  /**
   * Cattle create
   */
  export type CattleCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Cattle
     */
    select?: CattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Cattle
     */
    omit?: CattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CattleInclude<ExtArgs> | null;
    /**
     * The data needed to create a Cattle.
     */
    data: XOR<CattleCreateInput, CattleUncheckedCreateInput>;
  };

  /**
   * Cattle createMany
   */
  export type CattleCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * The data used to create many Cattles.
     */
    data: CattleCreateManyInput | CattleCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Cattle createManyAndReturn
   */
  export type CattleCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Cattle
     */
    select?: CattleSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Cattle
     */
    omit?: CattleOmit<ExtArgs> | null;
    /**
     * The data used to create many Cattles.
     */
    data: CattleCreateManyInput | CattleCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Cattle update
   */
  export type CattleUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Cattle
     */
    select?: CattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Cattle
     */
    omit?: CattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CattleInclude<ExtArgs> | null;
    /**
     * The data needed to update a Cattle.
     */
    data: XOR<CattleUpdateInput, CattleUncheckedUpdateInput>;
    /**
     * Choose, which Cattle to update.
     */
    where: CattleWhereUniqueInput;
  };

  /**
   * Cattle updateMany
   */
  export type CattleUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * The data used to update Cattles.
     */
    data: XOR<CattleUpdateManyMutationInput, CattleUncheckedUpdateManyInput>;
    /**
     * Filter which Cattles to update
     */
    where?: CattleWhereInput;
    /**
     * Limit how many Cattles to update.
     */
    limit?: number;
  };

  /**
   * Cattle updateManyAndReturn
   */
  export type CattleUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Cattle
     */
    select?: CattleSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Cattle
     */
    omit?: CattleOmit<ExtArgs> | null;
    /**
     * The data used to update Cattles.
     */
    data: XOR<CattleUpdateManyMutationInput, CattleUncheckedUpdateManyInput>;
    /**
     * Filter which Cattles to update
     */
    where?: CattleWhereInput;
    /**
     * Limit how many Cattles to update.
     */
    limit?: number;
  };

  /**
   * Cattle upsert
   */
  export type CattleUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Cattle
     */
    select?: CattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Cattle
     */
    omit?: CattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CattleInclude<ExtArgs> | null;
    /**
     * The filter to search for the Cattle to update in case it exists.
     */
    where: CattleWhereUniqueInput;
    /**
     * In case the Cattle found by the `where` argument doesn't exist, create a new Cattle with this data.
     */
    create: XOR<CattleCreateInput, CattleUncheckedCreateInput>;
    /**
     * In case the Cattle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CattleUpdateInput, CattleUncheckedUpdateInput>;
  };

  /**
   * Cattle delete
   */
  export type CattleDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Cattle
     */
    select?: CattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Cattle
     */
    omit?: CattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CattleInclude<ExtArgs> | null;
    /**
     * Filter which Cattle to delete.
     */
    where: CattleWhereUniqueInput;
  };

  /**
   * Cattle deleteMany
   */
  export type CattleDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Filter which Cattles to delete
     */
    where?: CattleWhereInput;
    /**
     * Limit how many Cattles to delete.
     */
    limit?: number;
  };

  /**
   * Cattle.transactionItems
   */
  export type Cattle$transactionItemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the TransactionItem
     */
    select?: TransactionItemSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionItem
     */
    omit?: TransactionItemOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionItemInclude<ExtArgs> | null;
    where?: TransactionItemWhereInput;
    orderBy?:
      | TransactionItemOrderByWithRelationInput
      | TransactionItemOrderByWithRelationInput[];
    cursor?: TransactionItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | TransactionItemScalarFieldEnum
      | TransactionItemScalarFieldEnum[];
  };

  /**
   * Cattle without action
   */
  export type CattleDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Cattle
     */
    select?: CattleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Cattle
     */
    omit?: CattleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CattleInclude<ExtArgs> | null;
  };

  /**
   * Model Customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null;
    _min: CustomerMinAggregateOutputType | null;
    _max: CustomerMaxAggregateOutputType | null;
  };

  export type CustomerMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    address: string | null;
    phone: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type CustomerMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    address: string | null;
    phone: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type CustomerCountAggregateOutputType = {
    id: number;
    name: number;
    address: number;
    phone: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type CustomerMinAggregateInputType = {
    id?: true;
    name?: true;
    address?: true;
    phone?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type CustomerMaxAggregateInputType = {
    id?: true;
    name?: true;
    address?: true;
    phone?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type CustomerCountAggregateInputType = {
    id?: true;
    name?: true;
    address?: true;
    phone?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type CustomerAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Filter which Customer to aggregate.
     */
    where?: CustomerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Customers to fetch.
     */
    orderBy?:
      | CustomerOrderByWithRelationInput
      | CustomerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: CustomerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Customers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Customers
     **/
    _count?: true | CustomerCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: CustomerMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: CustomerMaxAggregateInputType;
  };

  export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
    [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomer[P]>
      : GetScalarType<T[P], AggregateCustomer[P]>;
  };

  export type CustomerGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: CustomerWhereInput;
    orderBy?:
      | CustomerOrderByWithAggregationInput
      | CustomerOrderByWithAggregationInput[];
    by: CustomerScalarFieldEnum[] | CustomerScalarFieldEnum;
    having?: CustomerScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CustomerCountAggregateInputType | true;
    _min?: CustomerMinAggregateInputType;
    _max?: CustomerMaxAggregateInputType;
  };

  export type CustomerGroupByOutputType = {
    id: string;
    name: string;
    address: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
    _count: CustomerCountAggregateOutputType | null;
    _min: CustomerMinAggregateOutputType | null;
    _max: CustomerMaxAggregateOutputType | null;
  };

  type GetCustomerGroupByPayload<T extends CustomerGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<CustomerGroupByOutputType, T['by']> & {
          [P in keyof T & keyof CustomerGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerGroupByOutputType[P]>;
        }
      >
    >;

  export type CustomerSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      address?: boolean;
      phone?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      transactions?: boolean | Customer$transactionsArgs<ExtArgs>;
      _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['customer']
  >;

  export type CustomerSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      address?: boolean;
      phone?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['customer']
  >;

  export type CustomerSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      name?: boolean;
      address?: boolean;
      phone?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
    },
    ExtArgs['result']['customer']
  >;

  export type CustomerSelectScalar = {
    id?: boolean;
    name?: boolean;
    address?: boolean;
    phone?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type CustomerOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    'id' | 'name' | 'address' | 'phone' | 'createdAt' | 'updatedAt',
    ExtArgs['result']['customer']
  >;
  export type CustomerInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    transactions?: boolean | Customer$transactionsArgs<ExtArgs>;
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type CustomerIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {};
  export type CustomerIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {};

  export type $CustomerPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'Customer';
    objects: {
      transactions: Prisma.$TransactionPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        name: string;
        address: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['customer']
    >;
    composites: {};
  };

  type CustomerGetPayload<
    S extends boolean | null | undefined | CustomerDefaultArgs
  > = $Result.GetResult<Prisma.$CustomerPayload, S>;

  type CustomerCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<CustomerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CustomerCountAggregateInputType | true;
  };

  export interface CustomerDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Customer'];
      meta: { name: 'Customer' };
    };
    /**
     * Find zero or one Customer that matches the filter.
     * @param {CustomerFindUniqueArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerFindUniqueArgs>(
      args: SelectSubset<T, CustomerFindUniqueArgs<ExtArgs>>
    ): Prisma__CustomerClient<
      $Result.GetResult<
        Prisma.$CustomerPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Customer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CustomerFindUniqueOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerFindUniqueOrThrowArgs>(
      args: SelectSubset<T, CustomerFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__CustomerClient<
      $Result.GetResult<
        Prisma.$CustomerPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Customer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerFindFirstArgs>(
      args?: SelectSubset<T, CustomerFindFirstArgs<ExtArgs>>
    ): Prisma__CustomerClient<
      $Result.GetResult<
        Prisma.$CustomerPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Customer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerFindFirstOrThrowArgs>(
      args?: SelectSubset<T, CustomerFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__CustomerClient<
      $Result.GetResult<
        Prisma.$CustomerPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customer.findMany()
     *
     * // Get first 10 Customers
     * const customers = await prisma.customer.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const customerWithIdOnly = await prisma.customer.findMany({ select: { id: true } })
     *
     */
    findMany<T extends CustomerFindManyArgs>(
      args?: SelectSubset<T, CustomerFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CustomerPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Customer.
     * @param {CustomerCreateArgs} args - Arguments to create a Customer.
     * @example
     * // Create one Customer
     * const Customer = await prisma.customer.create({
     *   data: {
     *     // ... data to create a Customer
     *   }
     * })
     *
     */
    create<T extends CustomerCreateArgs>(
      args: SelectSubset<T, CustomerCreateArgs<ExtArgs>>
    ): Prisma__CustomerClient<
      $Result.GetResult<
        Prisma.$CustomerPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Customers.
     * @param {CustomerCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends CustomerCreateManyArgs>(
      args?: SelectSubset<T, CustomerCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Customers and returns the data saved in the database.
     * @param {CustomerCreateManyAndReturnArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Customers and only return the `id`
     * const customerWithIdOnly = await prisma.customer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends CustomerCreateManyAndReturnArgs>(
      args?: SelectSubset<T, CustomerCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CustomerPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Customer.
     * @param {CustomerDeleteArgs} args - Arguments to delete one Customer.
     * @example
     * // Delete one Customer
     * const Customer = await prisma.customer.delete({
     *   where: {
     *     // ... filter to delete one Customer
     *   }
     * })
     *
     */
    delete<T extends CustomerDeleteArgs>(
      args: SelectSubset<T, CustomerDeleteArgs<ExtArgs>>
    ): Prisma__CustomerClient<
      $Result.GetResult<
        Prisma.$CustomerPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Customer.
     * @param {CustomerUpdateArgs} args - Arguments to update one Customer.
     * @example
     * // Update one Customer
     * const customer = await prisma.customer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends CustomerUpdateArgs>(
      args: SelectSubset<T, CustomerUpdateArgs<ExtArgs>>
    ): Prisma__CustomerClient<
      $Result.GetResult<
        Prisma.$CustomerPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Customers.
     * @param {CustomerDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends CustomerDeleteManyArgs>(
      args?: SelectSubset<T, CustomerDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends CustomerUpdateManyArgs>(
      args: SelectSubset<T, CustomerUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Customers and returns the data updated in the database.
     * @param {CustomerUpdateManyAndReturnArgs} args - Arguments to update many Customers.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Customers and only return the `id`
     * const customerWithIdOnly = await prisma.customer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends CustomerUpdateManyAndReturnArgs>(
      args: SelectSubset<T, CustomerUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$CustomerPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Customer.
     * @param {CustomerUpsertArgs} args - Arguments to update or create a Customer.
     * @example
     * // Update or create a Customer
     * const customer = await prisma.customer.upsert({
     *   create: {
     *     // ... data to create a Customer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customer we want to update
     *   }
     * })
     */
    upsert<T extends CustomerUpsertArgs>(
      args: SelectSubset<T, CustomerUpsertArgs<ExtArgs>>
    ): Prisma__CustomerClient<
      $Result.GetResult<
        Prisma.$CustomerPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customer.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
     **/
    count<T extends CustomerCountArgs>(
      args?: Subset<T, CustomerCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends CustomerAggregateArgs>(
      args: Subset<T, CustomerAggregateArgs>
    ): Prisma.PrismaPromise<GetCustomerAggregateType<T>>;

    /**
     * Group by Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends CustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerGroupByArgs['orderBy'] }
        : { orderBy?: CustomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, CustomerGroupByArgs, OrderByArg> & InputErrors
    ): {} extends InputErrors
      ? GetCustomerGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Customer model
     */
    readonly fields: CustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Customer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    transactions<T extends Customer$transactionsArgs<ExtArgs> = {}>(
      args?: Subset<T, Customer$transactionsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$TransactionPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Customer model
   */
  interface CustomerFieldRefs {
    readonly id: FieldRef<'Customer', 'String'>;
    readonly name: FieldRef<'Customer', 'String'>;
    readonly address: FieldRef<'Customer', 'String'>;
    readonly phone: FieldRef<'Customer', 'String'>;
    readonly createdAt: FieldRef<'Customer', 'DateTime'>;
    readonly updatedAt: FieldRef<'Customer', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Customer findUnique
   */
  export type CustomerFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null;
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput;
  };

  /**
   * Customer findUniqueOrThrow
   */
  export type CustomerFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null;
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput;
  };

  /**
   * Customer findFirst
   */
  export type CustomerFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null;
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Customers to fetch.
     */
    orderBy?:
      | CustomerOrderByWithRelationInput
      | CustomerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Customers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[];
  };

  /**
   * Customer findFirstOrThrow
   */
  export type CustomerFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null;
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Customers to fetch.
     */
    orderBy?:
      | CustomerOrderByWithRelationInput
      | CustomerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Customers.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[];
  };

  /**
   * Customer findMany
   */
  export type CustomerFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null;
    /**
     * Filter, which Customers to fetch.
     */
    where?: CustomerWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Customers to fetch.
     */
    orderBy?:
      | CustomerOrderByWithRelationInput
      | CustomerOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Customers.
     */
    cursor?: CustomerWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Customers.
     */
    skip?: number;
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[];
  };

  /**
   * Customer create
   */
  export type CustomerCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null;
    /**
     * The data needed to create a Customer.
     */
    data: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>;
  };

  /**
   * Customer createMany
   */
  export type CustomerCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Customer createManyAndReturn
   */
  export type CustomerCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null;
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Customer update
   */
  export type CustomerUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null;
    /**
     * The data needed to update a Customer.
     */
    data: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>;
    /**
     * Choose, which Customer to update.
     */
    where: CustomerWhereUniqueInput;
  };

  /**
   * Customer updateMany
   */
  export type CustomerUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * The data used to update Customers.
     */
    data: XOR<
      CustomerUpdateManyMutationInput,
      CustomerUncheckedUpdateManyInput
    >;
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput;
    /**
     * Limit how many Customers to update.
     */
    limit?: number;
  };

  /**
   * Customer updateManyAndReturn
   */
  export type CustomerUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null;
    /**
     * The data used to update Customers.
     */
    data: XOR<
      CustomerUpdateManyMutationInput,
      CustomerUncheckedUpdateManyInput
    >;
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput;
    /**
     * Limit how many Customers to update.
     */
    limit?: number;
  };

  /**
   * Customer upsert
   */
  export type CustomerUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null;
    /**
     * The filter to search for the Customer to update in case it exists.
     */
    where: CustomerWhereUniqueInput;
    /**
     * In case the Customer found by the `where` argument doesn't exist, create a new Customer with this data.
     */
    create: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>;
    /**
     * In case the Customer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>;
  };

  /**
   * Customer delete
   */
  export type CustomerDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null;
    /**
     * Filter which Customer to delete.
     */
    where: CustomerWhereUniqueInput;
  };

  /**
   * Customer deleteMany
   */
  export type CustomerDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Filter which Customers to delete
     */
    where?: CustomerWhereInput;
    /**
     * Limit how many Customers to delete.
     */
    limit?: number;
  };

  /**
   * Customer.transactions
   */
  export type Customer$transactionsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    where?: TransactionWhereInput;
    orderBy?:
      | TransactionOrderByWithRelationInput
      | TransactionOrderByWithRelationInput[];
    cursor?: TransactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[];
  };

  /**
   * Customer without action
   */
  export type CustomerDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Customer
     */
    omit?: CustomerOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null;
  };

  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null;
    _avg: TransactionAvgAggregateOutputType | null;
    _sum: TransactionSumAggregateOutputType | null;
    _min: TransactionMinAggregateOutputType | null;
    _max: TransactionMaxAggregateOutputType | null;
  };

  export type TransactionAvgAggregateOutputType = {
    serialNumber: number | null;
  };

  export type TransactionSumAggregateOutputType = {
    serialNumber: number | null;
  };

  export type TransactionMinAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    serialNumber: number | null;
    remarks: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type TransactionMaxAggregateOutputType = {
    id: string | null;
    customerId: string | null;
    serialNumber: number | null;
    remarks: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type TransactionCountAggregateOutputType = {
    id: number;
    customerId: number;
    serialNumber: number;
    remarks: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type TransactionAvgAggregateInputType = {
    serialNumber?: true;
  };

  export type TransactionSumAggregateInputType = {
    serialNumber?: true;
  };

  export type TransactionMinAggregateInputType = {
    id?: true;
    customerId?: true;
    serialNumber?: true;
    remarks?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type TransactionMaxAggregateInputType = {
    id?: true;
    customerId?: true;
    serialNumber?: true;
    remarks?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type TransactionCountAggregateInputType = {
    id?: true;
    customerId?: true;
    serialNumber?: true;
    remarks?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type TransactionAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Transactions to fetch.
     */
    orderBy?:
      | TransactionOrderByWithRelationInput
      | TransactionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Transactions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Transactions
     **/
    _count?: true | TransactionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: TransactionAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: TransactionSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: TransactionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: TransactionMaxAggregateInputType;
  };

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> =
    {
      [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
        ? T[P] extends true
          ? number
          : GetScalarType<T[P], AggregateTransaction[P]>
        : GetScalarType<T[P], AggregateTransaction[P]>;
    };

  export type TransactionGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: TransactionWhereInput;
    orderBy?:
      | TransactionOrderByWithAggregationInput
      | TransactionOrderByWithAggregationInput[];
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum;
    having?: TransactionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TransactionCountAggregateInputType | true;
    _avg?: TransactionAvgAggregateInputType;
    _sum?: TransactionSumAggregateInputType;
    _min?: TransactionMinAggregateInputType;
    _max?: TransactionMaxAggregateInputType;
  };

  export type TransactionGroupByOutputType = {
    id: string;
    customerId: string;
    serialNumber: number | null;
    remarks: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: TransactionCountAggregateOutputType | null;
    _avg: TransactionAvgAggregateOutputType | null;
    _sum: TransactionSumAggregateOutputType | null;
    _min: TransactionMinAggregateOutputType | null;
    _max: TransactionMaxAggregateOutputType | null;
  };

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<TransactionGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof TransactionGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>;
        }
      >
    >;

  export type TransactionSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      customerId?: boolean;
      serialNumber?: boolean;
      remarks?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      customer?: boolean | CustomerDefaultArgs<ExtArgs>;
      transactionItems?: boolean | Transaction$transactionItemsArgs<ExtArgs>;
      _count?: boolean | TransactionCountOutputTypeDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['transaction']
  >;

  export type TransactionSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      customerId?: boolean;
      serialNumber?: boolean;
      remarks?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      customer?: boolean | CustomerDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['transaction']
  >;

  export type TransactionSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      customerId?: boolean;
      serialNumber?: boolean;
      remarks?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      customer?: boolean | CustomerDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['transaction']
  >;

  export type TransactionSelectScalar = {
    id?: boolean;
    customerId?: boolean;
    serialNumber?: boolean;
    remarks?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type TransactionOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    | 'id'
    | 'customerId'
    | 'serialNumber'
    | 'remarks'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['transaction']
  >;
  export type TransactionInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>;
    transactionItems?: boolean | Transaction$transactionItemsArgs<ExtArgs>;
    _count?: boolean | TransactionCountOutputTypeDefaultArgs<ExtArgs>;
  };
  export type TransactionIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>;
  };
  export type TransactionIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    customer?: boolean | CustomerDefaultArgs<ExtArgs>;
  };

  export type $TransactionPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'Transaction';
    objects: {
      customer: Prisma.$CustomerPayload<ExtArgs>;
      transactionItems: Prisma.$TransactionItemPayload<ExtArgs>[];
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        customerId: string;
        serialNumber: number | null;
        remarks: string | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['transaction']
    >;
    composites: {};
  };

  type TransactionGetPayload<
    S extends boolean | null | undefined | TransactionDefaultArgs
  > = $Result.GetResult<Prisma.$TransactionPayload, S>;

  type TransactionCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<
    TransactionFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: TransactionCountAggregateInputType | true;
  };

  export interface TransactionDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['Transaction'];
      meta: { name: 'Transaction' };
    };
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(
      args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>
    ): Prisma__TransactionClient<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(
      args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TransactionClient<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(
      args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>
    ): Prisma__TransactionClient<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TransactionClient<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     *
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TransactionFindManyArgs>(
      args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     *
     */
    create<T extends TransactionCreateArgs>(
      args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>
    ): Prisma__TransactionClient<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TransactionCreateManyArgs>(
      args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(
      args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     *
     */
    delete<T extends TransactionDeleteArgs>(
      args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>
    ): Prisma__TransactionClient<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TransactionUpdateArgs>(
      args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>
    ): Prisma__TransactionClient<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TransactionDeleteManyArgs>(
      args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TransactionUpdateManyArgs>(
      args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more Transactions and returns the data updated in the database.
     * @param {TransactionUpdateManyAndReturnArgs} args - Arguments to update many Transactions.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends TransactionUpdateManyAndReturnArgs>(
      args: SelectSubset<T, TransactionUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(
      args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>
    ): Prisma__TransactionClient<
      $Result.GetResult<
        Prisma.$TransactionPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
     **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends TransactionAggregateArgs>(
      args: Subset<T, TransactionAggregateArgs>
    ): Prisma.PrismaPromise<GetTransactionAggregateType<T>>;

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetTransactionGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Transaction model
     */
    readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    customer<T extends CustomerDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, CustomerDefaultArgs<ExtArgs>>
    ): Prisma__CustomerClient<
      | $Result.GetResult<
          Prisma.$CustomerPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    transactionItems<T extends Transaction$transactionItemsArgs<ExtArgs> = {}>(
      args?: Subset<T, Transaction$transactionItemsArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      | $Result.GetResult<
          Prisma.$TransactionItemPayload<ExtArgs>,
          T,
          'findMany',
          GlobalOmitOptions
        >
      | Null
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the Transaction model
   */
  interface TransactionFieldRefs {
    readonly id: FieldRef<'Transaction', 'String'>;
    readonly customerId: FieldRef<'Transaction', 'String'>;
    readonly serialNumber: FieldRef<'Transaction', 'Int'>;
    readonly remarks: FieldRef<'Transaction', 'String'>;
    readonly createdAt: FieldRef<'Transaction', 'DateTime'>;
    readonly updatedAt: FieldRef<'Transaction', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput;
  };

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput;
  };

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Transactions to fetch.
     */
    orderBy?:
      | TransactionOrderByWithRelationInput
      | TransactionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Transactions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[];
  };

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Transactions to fetch.
     */
    orderBy?:
      | TransactionOrderByWithRelationInput
      | TransactionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Transactions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[];
  };

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Transactions to fetch.
     */
    orderBy?:
      | TransactionOrderByWithRelationInput
      | TransactionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Transactions.
     */
    skip?: number;
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[];
  };

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>;
  };

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>;
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput;
  };

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<
      TransactionUpdateManyMutationInput,
      TransactionUncheckedUpdateManyInput
    >;
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput;
    /**
     * Limit how many Transactions to update.
     */
    limit?: number;
  };

  /**
   * Transaction updateManyAndReturn
   */
  export type TransactionUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * The data used to update Transactions.
     */
    data: XOR<
      TransactionUpdateManyMutationInput,
      TransactionUncheckedUpdateManyInput
    >;
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput;
    /**
     * Limit how many Transactions to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput;
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>;
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>;
  };

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput;
  };

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput;
    /**
     * Limit how many Transactions to delete.
     */
    limit?: number;
  };

  /**
   * Transaction.transactionItems
   */
  export type Transaction$transactionItemsArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the TransactionItem
     */
    select?: TransactionItemSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionItem
     */
    omit?: TransactionItemOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionItemInclude<ExtArgs> | null;
    where?: TransactionItemWhereInput;
    orderBy?:
      | TransactionItemOrderByWithRelationInput
      | TransactionItemOrderByWithRelationInput[];
    cursor?: TransactionItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?:
      | TransactionItemScalarFieldEnum
      | TransactionItemScalarFieldEnum[];
  };

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Transaction
     */
    omit?: TransactionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null;
  };

  /**
   * Model TransactionItem
   */

  export type AggregateTransactionItem = {
    _count: TransactionItemCountAggregateOutputType | null;
    _avg: TransactionItemAvgAggregateOutputType | null;
    _sum: TransactionItemSumAggregateOutputType | null;
    _min: TransactionItemMinAggregateOutputType | null;
    _max: TransactionItemMaxAggregateOutputType | null;
  };

  export type TransactionItemAvgAggregateOutputType = {
    estimatedSalePrice: number | null;
    actualSalePrice: number | null;
    totalPrice: number | null;
    paidAmount: number | null;
  };

  export type TransactionItemSumAggregateOutputType = {
    estimatedSalePrice: number | null;
    actualSalePrice: number | null;
    totalPrice: number | null;
    paidAmount: number | null;
  };

  export type TransactionItemMinAggregateOutputType = {
    id: string | null;
    transactionId: string | null;
    cattleId: string | null;
    estimatedSalePrice: number | null;
    actualSalePrice: number | null;
    totalPrice: number | null;
    paymentStatus: $Enums.PaymentStatus | null;
    paymentDate: Date | null;
    paymentMethod: $Enums.PaymentMethod | null;
    paidAmount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type TransactionItemMaxAggregateOutputType = {
    id: string | null;
    transactionId: string | null;
    cattleId: string | null;
    estimatedSalePrice: number | null;
    actualSalePrice: number | null;
    totalPrice: number | null;
    paymentStatus: $Enums.PaymentStatus | null;
    paymentDate: Date | null;
    paymentMethod: $Enums.PaymentMethod | null;
    paidAmount: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };

  export type TransactionItemCountAggregateOutputType = {
    id: number;
    transactionId: number;
    cattleId: number;
    estimatedSalePrice: number;
    actualSalePrice: number;
    totalPrice: number;
    paymentStatus: number;
    paymentDate: number;
    paymentMethod: number;
    paidAmount: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
  };

  export type TransactionItemAvgAggregateInputType = {
    estimatedSalePrice?: true;
    actualSalePrice?: true;
    totalPrice?: true;
    paidAmount?: true;
  };

  export type TransactionItemSumAggregateInputType = {
    estimatedSalePrice?: true;
    actualSalePrice?: true;
    totalPrice?: true;
    paidAmount?: true;
  };

  export type TransactionItemMinAggregateInputType = {
    id?: true;
    transactionId?: true;
    cattleId?: true;
    estimatedSalePrice?: true;
    actualSalePrice?: true;
    totalPrice?: true;
    paymentStatus?: true;
    paymentDate?: true;
    paymentMethod?: true;
    paidAmount?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type TransactionItemMaxAggregateInputType = {
    id?: true;
    transactionId?: true;
    cattleId?: true;
    estimatedSalePrice?: true;
    actualSalePrice?: true;
    totalPrice?: true;
    paymentStatus?: true;
    paymentDate?: true;
    paymentMethod?: true;
    paidAmount?: true;
    createdAt?: true;
    updatedAt?: true;
  };

  export type TransactionItemCountAggregateInputType = {
    id?: true;
    transactionId?: true;
    cattleId?: true;
    estimatedSalePrice?: true;
    actualSalePrice?: true;
    totalPrice?: true;
    paymentStatus?: true;
    paymentDate?: true;
    paymentMethod?: true;
    paidAmount?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
  };

  export type TransactionItemAggregateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Filter which TransactionItem to aggregate.
     */
    where?: TransactionItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TransactionItems to fetch.
     */
    orderBy?:
      | TransactionItemOrderByWithRelationInput
      | TransactionItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: TransactionItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TransactionItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TransactionItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned TransactionItems
     **/
    _count?: true | TransactionItemCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
     **/
    _avg?: TransactionItemAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
     **/
    _sum?: TransactionItemSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: TransactionItemMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: TransactionItemMaxAggregateInputType;
  };

  export type GetTransactionItemAggregateType<
    T extends TransactionItemAggregateArgs
  > = {
    [P in keyof T & keyof AggregateTransactionItem]: P extends
      | '_count'
      | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransactionItem[P]>
      : GetScalarType<T[P], AggregateTransactionItem[P]>;
  };

  export type TransactionItemGroupByArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    where?: TransactionItemWhereInput;
    orderBy?:
      | TransactionItemOrderByWithAggregationInput
      | TransactionItemOrderByWithAggregationInput[];
    by: TransactionItemScalarFieldEnum[] | TransactionItemScalarFieldEnum;
    having?: TransactionItemScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TransactionItemCountAggregateInputType | true;
    _avg?: TransactionItemAvgAggregateInputType;
    _sum?: TransactionItemSumAggregateInputType;
    _min?: TransactionItemMinAggregateInputType;
    _max?: TransactionItemMaxAggregateInputType;
  };

  export type TransactionItemGroupByOutputType = {
    id: string;
    transactionId: string;
    cattleId: string;
    estimatedSalePrice: number;
    actualSalePrice: number;
    totalPrice: number;
    paymentStatus: $Enums.PaymentStatus;
    paymentDate: Date | null;
    paymentMethod: $Enums.PaymentMethod | null;
    paidAmount: number | null;
    createdAt: Date;
    updatedAt: Date;
    _count: TransactionItemCountAggregateOutputType | null;
    _avg: TransactionItemAvgAggregateOutputType | null;
    _sum: TransactionItemSumAggregateOutputType | null;
    _min: TransactionItemMinAggregateOutputType | null;
    _max: TransactionItemMaxAggregateOutputType | null;
  };

  type GetTransactionItemGroupByPayload<T extends TransactionItemGroupByArgs> =
    Prisma.PrismaPromise<
      Array<
        PickEnumerable<TransactionItemGroupByOutputType, T['by']> & {
          [P in keyof T &
            keyof TransactionItemGroupByOutputType]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionItemGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionItemGroupByOutputType[P]>;
        }
      >
    >;

  export type TransactionItemSelect<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      transactionId?: boolean;
      cattleId?: boolean;
      estimatedSalePrice?: boolean;
      actualSalePrice?: boolean;
      totalPrice?: boolean;
      paymentStatus?: boolean;
      paymentDate?: boolean;
      paymentMethod?: boolean;
      paidAmount?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      transaction?: boolean | TransactionDefaultArgs<ExtArgs>;
      cattle?: boolean | CattleDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['transactionItem']
  >;

  export type TransactionItemSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      transactionId?: boolean;
      cattleId?: boolean;
      estimatedSalePrice?: boolean;
      actualSalePrice?: boolean;
      totalPrice?: boolean;
      paymentStatus?: boolean;
      paymentDate?: boolean;
      paymentMethod?: boolean;
      paidAmount?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      transaction?: boolean | TransactionDefaultArgs<ExtArgs>;
      cattle?: boolean | CattleDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['transactionItem']
  >;

  export type TransactionItemSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetSelect<
    {
      id?: boolean;
      transactionId?: boolean;
      cattleId?: boolean;
      estimatedSalePrice?: boolean;
      actualSalePrice?: boolean;
      totalPrice?: boolean;
      paymentStatus?: boolean;
      paymentDate?: boolean;
      paymentMethod?: boolean;
      paidAmount?: boolean;
      createdAt?: boolean;
      updatedAt?: boolean;
      transaction?: boolean | TransactionDefaultArgs<ExtArgs>;
      cattle?: boolean | CattleDefaultArgs<ExtArgs>;
    },
    ExtArgs['result']['transactionItem']
  >;

  export type TransactionItemSelectScalar = {
    id?: boolean;
    transactionId?: boolean;
    cattleId?: boolean;
    estimatedSalePrice?: boolean;
    actualSalePrice?: boolean;
    totalPrice?: boolean;
    paymentStatus?: boolean;
    paymentDate?: boolean;
    paymentMethod?: boolean;
    paidAmount?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
  };

  export type TransactionItemOmit<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = $Extensions.GetOmit<
    | 'id'
    | 'transactionId'
    | 'cattleId'
    | 'estimatedSalePrice'
    | 'actualSalePrice'
    | 'totalPrice'
    | 'paymentStatus'
    | 'paymentDate'
    | 'paymentMethod'
    | 'paidAmount'
    | 'createdAt'
    | 'updatedAt',
    ExtArgs['result']['transactionItem']
  >;
  export type TransactionItemInclude<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    transaction?: boolean | TransactionDefaultArgs<ExtArgs>;
    cattle?: boolean | CattleDefaultArgs<ExtArgs>;
  };
  export type TransactionItemIncludeCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    transaction?: boolean | TransactionDefaultArgs<ExtArgs>;
    cattle?: boolean | CattleDefaultArgs<ExtArgs>;
  };
  export type TransactionItemIncludeUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    transaction?: boolean | TransactionDefaultArgs<ExtArgs>;
    cattle?: boolean | CattleDefaultArgs<ExtArgs>;
  };

  export type $TransactionItemPayload<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    name: 'TransactionItem';
    objects: {
      transaction: Prisma.$TransactionPayload<ExtArgs>;
      cattle: Prisma.$CattlePayload<ExtArgs>;
    };
    scalars: $Extensions.GetPayloadResult<
      {
        id: string;
        transactionId: string;
        cattleId: string;
        estimatedSalePrice: number;
        actualSalePrice: number;
        totalPrice: number;
        paymentStatus: $Enums.PaymentStatus;
        paymentDate: Date | null;
        paymentMethod: $Enums.PaymentMethod | null;
        paidAmount: number | null;
        createdAt: Date;
        updatedAt: Date;
      },
      ExtArgs['result']['transactionItem']
    >;
    composites: {};
  };

  type TransactionItemGetPayload<
    S extends boolean | null | undefined | TransactionItemDefaultArgs
  > = $Result.GetResult<Prisma.$TransactionItemPayload, S>;

  type TransactionItemCountArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = Omit<
    TransactionItemFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: TransactionItemCountAggregateInputType | true;
  };

  export interface TransactionItemDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > {
    [K: symbol]: {
      types: Prisma.TypeMap<ExtArgs>['model']['TransactionItem'];
      meta: { name: 'TransactionItem' };
    };
    /**
     * Find zero or one TransactionItem that matches the filter.
     * @param {TransactionItemFindUniqueArgs} args - Arguments to find a TransactionItem
     * @example
     * // Get one TransactionItem
     * const transactionItem = await prisma.transactionItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionItemFindUniqueArgs>(
      args: SelectSubset<T, TransactionItemFindUniqueArgs<ExtArgs>>
    ): Prisma__TransactionItemClient<
      $Result.GetResult<
        Prisma.$TransactionItemPayload<ExtArgs>,
        T,
        'findUnique',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find one TransactionItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransactionItemFindUniqueOrThrowArgs} args - Arguments to find a TransactionItem
     * @example
     * // Get one TransactionItem
     * const transactionItem = await prisma.transactionItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionItemFindUniqueOrThrowArgs>(
      args: SelectSubset<T, TransactionItemFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TransactionItemClient<
      $Result.GetResult<
        Prisma.$TransactionItemPayload<ExtArgs>,
        T,
        'findUniqueOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first TransactionItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionItemFindFirstArgs} args - Arguments to find a TransactionItem
     * @example
     * // Get one TransactionItem
     * const transactionItem = await prisma.transactionItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionItemFindFirstArgs>(
      args?: SelectSubset<T, TransactionItemFindFirstArgs<ExtArgs>>
    ): Prisma__TransactionItemClient<
      $Result.GetResult<
        Prisma.$TransactionItemPayload<ExtArgs>,
        T,
        'findFirst',
        GlobalOmitOptions
      > | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find the first TransactionItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionItemFindFirstOrThrowArgs} args - Arguments to find a TransactionItem
     * @example
     * // Get one TransactionItem
     * const transactionItem = await prisma.transactionItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionItemFindFirstOrThrowArgs>(
      args?: SelectSubset<T, TransactionItemFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TransactionItemClient<
      $Result.GetResult<
        Prisma.$TransactionItemPayload<ExtArgs>,
        T,
        'findFirstOrThrow',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Find zero or more TransactionItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TransactionItems
     * const transactionItems = await prisma.transactionItem.findMany()
     *
     * // Get first 10 TransactionItems
     * const transactionItems = await prisma.transactionItem.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const transactionItemWithIdOnly = await prisma.transactionItem.findMany({ select: { id: true } })
     *
     */
    findMany<T extends TransactionItemFindManyArgs>(
      args?: SelectSubset<T, TransactionItemFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TransactionItemPayload<ExtArgs>,
        T,
        'findMany',
        GlobalOmitOptions
      >
    >;

    /**
     * Create a TransactionItem.
     * @param {TransactionItemCreateArgs} args - Arguments to create a TransactionItem.
     * @example
     * // Create one TransactionItem
     * const TransactionItem = await prisma.transactionItem.create({
     *   data: {
     *     // ... data to create a TransactionItem
     *   }
     * })
     *
     */
    create<T extends TransactionItemCreateArgs>(
      args: SelectSubset<T, TransactionItemCreateArgs<ExtArgs>>
    ): Prisma__TransactionItemClient<
      $Result.GetResult<
        Prisma.$TransactionItemPayload<ExtArgs>,
        T,
        'create',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Create many TransactionItems.
     * @param {TransactionItemCreateManyArgs} args - Arguments to create many TransactionItems.
     * @example
     * // Create many TransactionItems
     * const transactionItem = await prisma.transactionItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends TransactionItemCreateManyArgs>(
      args?: SelectSubset<T, TransactionItemCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Create many TransactionItems and returns the data saved in the database.
     * @param {TransactionItemCreateManyAndReturnArgs} args - Arguments to create many TransactionItems.
     * @example
     * // Create many TransactionItems
     * const transactionItem = await prisma.transactionItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many TransactionItems and only return the `id`
     * const transactionItemWithIdOnly = await prisma.transactionItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends TransactionItemCreateManyAndReturnArgs>(
      args?: SelectSubset<T, TransactionItemCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TransactionItemPayload<ExtArgs>,
        T,
        'createManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Delete a TransactionItem.
     * @param {TransactionItemDeleteArgs} args - Arguments to delete one TransactionItem.
     * @example
     * // Delete one TransactionItem
     * const TransactionItem = await prisma.transactionItem.delete({
     *   where: {
     *     // ... filter to delete one TransactionItem
     *   }
     * })
     *
     */
    delete<T extends TransactionItemDeleteArgs>(
      args: SelectSubset<T, TransactionItemDeleteArgs<ExtArgs>>
    ): Prisma__TransactionItemClient<
      $Result.GetResult<
        Prisma.$TransactionItemPayload<ExtArgs>,
        T,
        'delete',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Update one TransactionItem.
     * @param {TransactionItemUpdateArgs} args - Arguments to update one TransactionItem.
     * @example
     * // Update one TransactionItem
     * const transactionItem = await prisma.transactionItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends TransactionItemUpdateArgs>(
      args: SelectSubset<T, TransactionItemUpdateArgs<ExtArgs>>
    ): Prisma__TransactionItemClient<
      $Result.GetResult<
        Prisma.$TransactionItemPayload<ExtArgs>,
        T,
        'update',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Delete zero or more TransactionItems.
     * @param {TransactionItemDeleteManyArgs} args - Arguments to filter TransactionItems to delete.
     * @example
     * // Delete a few TransactionItems
     * const { count } = await prisma.transactionItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends TransactionItemDeleteManyArgs>(
      args?: SelectSubset<T, TransactionItemDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more TransactionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TransactionItems
     * const transactionItem = await prisma.transactionItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends TransactionItemUpdateManyArgs>(
      args: SelectSubset<T, TransactionItemUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>;

    /**
     * Update zero or more TransactionItems and returns the data updated in the database.
     * @param {TransactionItemUpdateManyAndReturnArgs} args - Arguments to update many TransactionItems.
     * @example
     * // Update many TransactionItems
     * const transactionItem = await prisma.transactionItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more TransactionItems and only return the `id`
     * const transactionItemWithIdOnly = await prisma.transactionItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends TransactionItemUpdateManyAndReturnArgs>(
      args: SelectSubset<T, TransactionItemUpdateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<
      $Result.GetResult<
        Prisma.$TransactionItemPayload<ExtArgs>,
        T,
        'updateManyAndReturn',
        GlobalOmitOptions
      >
    >;

    /**
     * Create or update one TransactionItem.
     * @param {TransactionItemUpsertArgs} args - Arguments to update or create a TransactionItem.
     * @example
     * // Update or create a TransactionItem
     * const transactionItem = await prisma.transactionItem.upsert({
     *   create: {
     *     // ... data to create a TransactionItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TransactionItem we want to update
     *   }
     * })
     */
    upsert<T extends TransactionItemUpsertArgs>(
      args: SelectSubset<T, TransactionItemUpsertArgs<ExtArgs>>
    ): Prisma__TransactionItemClient<
      $Result.GetResult<
        Prisma.$TransactionItemPayload<ExtArgs>,
        T,
        'upsert',
        GlobalOmitOptions
      >,
      never,
      ExtArgs,
      GlobalOmitOptions
    >;

    /**
     * Count the number of TransactionItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionItemCountArgs} args - Arguments to filter TransactionItems to count.
     * @example
     * // Count the number of TransactionItems
     * const count = await prisma.transactionItem.count({
     *   where: {
     *     // ... the filter for the TransactionItems we want to count
     *   }
     * })
     **/
    count<T extends TransactionItemCountArgs>(
      args?: Subset<T, TransactionItemCountArgs>
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionItemCountAggregateOutputType>
        : number
    >;

    /**
     * Allows you to perform aggregations operations on a TransactionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends TransactionItemAggregateArgs>(
      args: Subset<T, TransactionItemAggregateArgs>
    ): Prisma.PrismaPromise<GetTransactionItemAggregateType<T>>;

    /**
     * Group by TransactionItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends TransactionItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionItemGroupByArgs['orderBy'] }
        : { orderBy?: TransactionItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<
        Keys<MaybeTupleToUnion<T['orderBy']>>
      >,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [
                      Error,
                      'Field ',
                      P,
                      ` in "having" needs to be provided in "by"`
                    ];
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                  }[OrderFields]
    >(
      args: SubsetIntersection<T, TransactionItemGroupByArgs, OrderByArg> &
        InputErrors
    ): {} extends InputErrors
      ? GetTransactionItemGroupByPayload<T>
      : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the TransactionItem model
     */
    readonly fields: TransactionItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TransactionItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionItemClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {}
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';
    transaction<T extends TransactionDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, TransactionDefaultArgs<ExtArgs>>
    ): Prisma__TransactionClient<
      | $Result.GetResult<
          Prisma.$TransactionPayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    cattle<T extends CattleDefaultArgs<ExtArgs> = {}>(
      args?: Subset<T, CattleDefaultArgs<ExtArgs>>
    ): Prisma__CattleClient<
      | $Result.GetResult<
          Prisma.$CattlePayload<ExtArgs>,
          T,
          'findUniqueOrThrow',
          GlobalOmitOptions
        >
      | Null,
      Null,
      ExtArgs,
      GlobalOmitOptions
    >;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?:
        | ((value: T) => TResult1 | PromiseLike<TResult1>)
        | undefined
        | null,
      onrejected?:
        | ((reason: any) => TResult2 | PromiseLike<TResult2>)
        | undefined
        | null
    ): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?:
        | ((reason: any) => TResult | PromiseLike<TResult>)
        | undefined
        | null
    ): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }

  /**
   * Fields of the TransactionItem model
   */
  interface TransactionItemFieldRefs {
    readonly id: FieldRef<'TransactionItem', 'String'>;
    readonly transactionId: FieldRef<'TransactionItem', 'String'>;
    readonly cattleId: FieldRef<'TransactionItem', 'String'>;
    readonly estimatedSalePrice: FieldRef<'TransactionItem', 'Int'>;
    readonly actualSalePrice: FieldRef<'TransactionItem', 'Int'>;
    readonly totalPrice: FieldRef<'TransactionItem', 'Int'>;
    readonly paymentStatus: FieldRef<'TransactionItem', 'PaymentStatus'>;
    readonly paymentDate: FieldRef<'TransactionItem', 'DateTime'>;
    readonly paymentMethod: FieldRef<'TransactionItem', 'PaymentMethod'>;
    readonly paidAmount: FieldRef<'TransactionItem', 'Int'>;
    readonly createdAt: FieldRef<'TransactionItem', 'DateTime'>;
    readonly updatedAt: FieldRef<'TransactionItem', 'DateTime'>;
  }

  // Custom InputTypes
  /**
   * TransactionItem findUnique
   */
  export type TransactionItemFindUniqueArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the TransactionItem
     */
    select?: TransactionItemSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionItem
     */
    omit?: TransactionItemOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionItemInclude<ExtArgs> | null;
    /**
     * Filter, which TransactionItem to fetch.
     */
    where: TransactionItemWhereUniqueInput;
  };

  /**
   * TransactionItem findUniqueOrThrow
   */
  export type TransactionItemFindUniqueOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the TransactionItem
     */
    select?: TransactionItemSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionItem
     */
    omit?: TransactionItemOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionItemInclude<ExtArgs> | null;
    /**
     * Filter, which TransactionItem to fetch.
     */
    where: TransactionItemWhereUniqueInput;
  };

  /**
   * TransactionItem findFirst
   */
  export type TransactionItemFindFirstArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the TransactionItem
     */
    select?: TransactionItemSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionItem
     */
    omit?: TransactionItemOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionItemInclude<ExtArgs> | null;
    /**
     * Filter, which TransactionItem to fetch.
     */
    where?: TransactionItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TransactionItems to fetch.
     */
    orderBy?:
      | TransactionItemOrderByWithRelationInput
      | TransactionItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TransactionItems.
     */
    cursor?: TransactionItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TransactionItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TransactionItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TransactionItems.
     */
    distinct?:
      | TransactionItemScalarFieldEnum
      | TransactionItemScalarFieldEnum[];
  };

  /**
   * TransactionItem findFirstOrThrow
   */
  export type TransactionItemFindFirstOrThrowArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the TransactionItem
     */
    select?: TransactionItemSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionItem
     */
    omit?: TransactionItemOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionItemInclude<ExtArgs> | null;
    /**
     * Filter, which TransactionItem to fetch.
     */
    where?: TransactionItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TransactionItems to fetch.
     */
    orderBy?:
      | TransactionItemOrderByWithRelationInput
      | TransactionItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for TransactionItems.
     */
    cursor?: TransactionItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TransactionItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TransactionItems.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of TransactionItems.
     */
    distinct?:
      | TransactionItemScalarFieldEnum
      | TransactionItemScalarFieldEnum[];
  };

  /**
   * TransactionItem findMany
   */
  export type TransactionItemFindManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the TransactionItem
     */
    select?: TransactionItemSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionItem
     */
    omit?: TransactionItemOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionItemInclude<ExtArgs> | null;
    /**
     * Filter, which TransactionItems to fetch.
     */
    where?: TransactionItemWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of TransactionItems to fetch.
     */
    orderBy?:
      | TransactionItemOrderByWithRelationInput
      | TransactionItemOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing TransactionItems.
     */
    cursor?: TransactionItemWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` TransactionItems from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` TransactionItems.
     */
    skip?: number;
    distinct?:
      | TransactionItemScalarFieldEnum
      | TransactionItemScalarFieldEnum[];
  };

  /**
   * TransactionItem create
   */
  export type TransactionItemCreateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the TransactionItem
     */
    select?: TransactionItemSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionItem
     */
    omit?: TransactionItemOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionItemInclude<ExtArgs> | null;
    /**
     * The data needed to create a TransactionItem.
     */
    data: XOR<TransactionItemCreateInput, TransactionItemUncheckedCreateInput>;
  };

  /**
   * TransactionItem createMany
   */
  export type TransactionItemCreateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * The data used to create many TransactionItems.
     */
    data: TransactionItemCreateManyInput | TransactionItemCreateManyInput[];
    skipDuplicates?: boolean;
  };

  /**
   * TransactionItem createManyAndReturn
   */
  export type TransactionItemCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the TransactionItem
     */
    select?: TransactionItemSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionItem
     */
    omit?: TransactionItemOmit<ExtArgs> | null;
    /**
     * The data used to create many TransactionItems.
     */
    data: TransactionItemCreateManyInput | TransactionItemCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionItemIncludeCreateManyAndReturn<ExtArgs> | null;
  };

  /**
   * TransactionItem update
   */
  export type TransactionItemUpdateArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the TransactionItem
     */
    select?: TransactionItemSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionItem
     */
    omit?: TransactionItemOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionItemInclude<ExtArgs> | null;
    /**
     * The data needed to update a TransactionItem.
     */
    data: XOR<TransactionItemUpdateInput, TransactionItemUncheckedUpdateInput>;
    /**
     * Choose, which TransactionItem to update.
     */
    where: TransactionItemWhereUniqueInput;
  };

  /**
   * TransactionItem updateMany
   */
  export type TransactionItemUpdateManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * The data used to update TransactionItems.
     */
    data: XOR<
      TransactionItemUpdateManyMutationInput,
      TransactionItemUncheckedUpdateManyInput
    >;
    /**
     * Filter which TransactionItems to update
     */
    where?: TransactionItemWhereInput;
    /**
     * Limit how many TransactionItems to update.
     */
    limit?: number;
  };

  /**
   * TransactionItem updateManyAndReturn
   */
  export type TransactionItemUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the TransactionItem
     */
    select?: TransactionItemSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionItem
     */
    omit?: TransactionItemOmit<ExtArgs> | null;
    /**
     * The data used to update TransactionItems.
     */
    data: XOR<
      TransactionItemUpdateManyMutationInput,
      TransactionItemUncheckedUpdateManyInput
    >;
    /**
     * Filter which TransactionItems to update
     */
    where?: TransactionItemWhereInput;
    /**
     * Limit how many TransactionItems to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionItemIncludeUpdateManyAndReturn<ExtArgs> | null;
  };

  /**
   * TransactionItem upsert
   */
  export type TransactionItemUpsertArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the TransactionItem
     */
    select?: TransactionItemSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionItem
     */
    omit?: TransactionItemOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionItemInclude<ExtArgs> | null;
    /**
     * The filter to search for the TransactionItem to update in case it exists.
     */
    where: TransactionItemWhereUniqueInput;
    /**
     * In case the TransactionItem found by the `where` argument doesn't exist, create a new TransactionItem with this data.
     */
    create: XOR<
      TransactionItemCreateInput,
      TransactionItemUncheckedCreateInput
    >;
    /**
     * In case the TransactionItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<
      TransactionItemUpdateInput,
      TransactionItemUncheckedUpdateInput
    >;
  };

  /**
   * TransactionItem delete
   */
  export type TransactionItemDeleteArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the TransactionItem
     */
    select?: TransactionItemSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionItem
     */
    omit?: TransactionItemOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionItemInclude<ExtArgs> | null;
    /**
     * Filter which TransactionItem to delete.
     */
    where: TransactionItemWhereUniqueInput;
  };

  /**
   * TransactionItem deleteMany
   */
  export type TransactionItemDeleteManyArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Filter which TransactionItems to delete
     */
    where?: TransactionItemWhereInput;
    /**
     * Limit how many TransactionItems to delete.
     */
    limit?: number;
  };

  /**
   * TransactionItem without action
   */
  export type TransactionItemDefaultArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
  > = {
    /**
     * Select specific fields to fetch from the TransactionItem
     */
    select?: TransactionItemSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the TransactionItem
     */
    omit?: TransactionItemOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionItemInclude<ExtArgs> | null;
  };

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted';
    ReadCommitted: 'ReadCommitted';
    RepeatableRead: 'RepeatableRead';
    Serializable: 'Serializable';
  };

  export type TransactionIsolationLevel =
    (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

  export const CattleScalarFieldEnum: {
    id: 'id';
    cattleNumber: 'cattleNumber';
    name: 'name';
    gender: 'gender';
    liveWeight: 'liveWeight';
    meatPercentage: 'meatPercentage';
    fatPercentage: 'fatPercentage';
    purchasePricePerKg: 'purchasePricePerKg';
    cattleClass: 'cattleClass';
    imageUrl: 'imageUrl';
    isSold: 'isSold';
    isQuarantined: 'isQuarantined';
    isPregnant: 'isPregnant';
    isLactating: 'isLactating';
    isInseminated: 'isInseminated';
    healthStatus: 'healthStatus';
    healthNotes: 'healthNotes';
    isVaccinated: 'isVaccinated';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type CattleScalarFieldEnum =
    (typeof CattleScalarFieldEnum)[keyof typeof CattleScalarFieldEnum];

  export const CustomerScalarFieldEnum: {
    id: 'id';
    name: 'name';
    address: 'address';
    phone: 'phone';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type CustomerScalarFieldEnum =
    (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum];

  export const TransactionScalarFieldEnum: {
    id: 'id';
    customerId: 'customerId';
    serialNumber: 'serialNumber';
    remarks: 'remarks';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type TransactionScalarFieldEnum =
    (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum];

  export const TransactionItemScalarFieldEnum: {
    id: 'id';
    transactionId: 'transactionId';
    cattleId: 'cattleId';
    estimatedSalePrice: 'estimatedSalePrice';
    actualSalePrice: 'actualSalePrice';
    totalPrice: 'totalPrice';
    paymentStatus: 'paymentStatus';
    paymentDate: 'paymentDate';
    paymentMethod: 'paymentMethod';
    paidAmount: 'paidAmount';
    createdAt: 'createdAt';
    updatedAt: 'updatedAt';
  };

  export type TransactionItemScalarFieldEnum =
    (typeof TransactionItemScalarFieldEnum)[keyof typeof TransactionItemScalarFieldEnum];

  export const SortOrder: {
    asc: 'asc';
    desc: 'desc';
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

  export const QueryMode: {
    default: 'default';
    insensitive: 'insensitive';
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

  export const NullsOrder: {
    first: 'first';
    last: 'last';
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String'
  >;

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'String[]'
  >;

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int'
  >;

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Int[]'
  >;

  /**
   * Reference to a field of type 'Gender'
   */
  export type EnumGenderFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Gender'
  >;

  /**
   * Reference to a field of type 'Gender[]'
   */
  export type ListEnumGenderFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Gender[]'
  >;

  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Decimal'
  >;

  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Decimal[]'
  >;

  /**
   * Reference to a field of type 'CattleClass'
   */
  export type EnumCattleClassFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'CattleClass'
  >;

  /**
   * Reference to a field of type 'CattleClass[]'
   */
  export type ListEnumCattleClassFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'CattleClass[]'>;

  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Boolean'
  >;

  /**
   * Reference to a field of type 'HealthStatus'
   */
  export type EnumHealthStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'HealthStatus'
  >;

  /**
   * Reference to a field of type 'HealthStatus[]'
   */
  export type ListEnumHealthStatusFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'HealthStatus[]'>;

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime'
  >;

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'DateTime[]'
  >;

  /**
   * Reference to a field of type 'PaymentStatus'
   */
  export type EnumPaymentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'PaymentStatus'
  >;

  /**
   * Reference to a field of type 'PaymentStatus[]'
   */
  export type ListEnumPaymentStatusFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'PaymentStatus[]'>;

  /**
   * Reference to a field of type 'PaymentMethod'
   */
  export type EnumPaymentMethodFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'PaymentMethod'
  >;

  /**
   * Reference to a field of type 'PaymentMethod[]'
   */
  export type ListEnumPaymentMethodFieldRefInput<$PrismaModel> =
    FieldRefInputType<$PrismaModel, 'PaymentMethod[]'>;

  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float'
  >;

  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<
    $PrismaModel,
    'Float[]'
  >;

  /**
   * Deep Input Types
   */

  export type CattleWhereInput = {
    AND?: CattleWhereInput | CattleWhereInput[];
    OR?: CattleWhereInput[];
    NOT?: CattleWhereInput | CattleWhereInput[];
    id?: StringFilter<'Cattle'> | string;
    cattleNumber?: IntFilter<'Cattle'> | number;
    name?: StringNullableFilter<'Cattle'> | string | null;
    gender?: EnumGenderFilter<'Cattle'> | $Enums.Gender;
    liveWeight?: IntFilter<'Cattle'> | number;
    meatPercentage?:
      | DecimalFilter<'Cattle'>
      | Decimal
      | DecimalJsLike
      | number
      | string;
    fatPercentage?:
      | DecimalFilter<'Cattle'>
      | Decimal
      | DecimalJsLike
      | number
      | string;
    purchasePricePerKg?: IntFilter<'Cattle'> | number;
    cattleClass?: EnumCattleClassFilter<'Cattle'> | $Enums.CattleClass;
    imageUrl?: StringNullableFilter<'Cattle'> | string | null;
    isSold?: BoolFilter<'Cattle'> | boolean;
    isQuarantined?: BoolFilter<'Cattle'> | boolean;
    isPregnant?: BoolFilter<'Cattle'> | boolean;
    isLactating?: BoolFilter<'Cattle'> | boolean;
    isInseminated?: BoolFilter<'Cattle'> | boolean;
    healthStatus?: EnumHealthStatusFilter<'Cattle'> | $Enums.HealthStatus;
    healthNotes?: StringNullableFilter<'Cattle'> | string | null;
    isVaccinated?: BoolFilter<'Cattle'> | boolean;
    createdAt?: DateTimeFilter<'Cattle'> | Date | string;
    updatedAt?: DateTimeFilter<'Cattle'> | Date | string;
    transactionItems?: TransactionItemListRelationFilter;
  };

  export type CattleOrderByWithRelationInput = {
    id?: SortOrder;
    cattleNumber?: SortOrder;
    name?: SortOrderInput | SortOrder;
    gender?: SortOrder;
    liveWeight?: SortOrder;
    meatPercentage?: SortOrder;
    fatPercentage?: SortOrder;
    purchasePricePerKg?: SortOrder;
    cattleClass?: SortOrder;
    imageUrl?: SortOrderInput | SortOrder;
    isSold?: SortOrder;
    isQuarantined?: SortOrder;
    isPregnant?: SortOrder;
    isLactating?: SortOrder;
    isInseminated?: SortOrder;
    healthStatus?: SortOrder;
    healthNotes?: SortOrderInput | SortOrder;
    isVaccinated?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    transactionItems?: TransactionItemOrderByRelationAggregateInput;
  };

  export type CattleWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: CattleWhereInput | CattleWhereInput[];
      OR?: CattleWhereInput[];
      NOT?: CattleWhereInput | CattleWhereInput[];
      cattleNumber?: IntFilter<'Cattle'> | number;
      name?: StringNullableFilter<'Cattle'> | string | null;
      gender?: EnumGenderFilter<'Cattle'> | $Enums.Gender;
      liveWeight?: IntFilter<'Cattle'> | number;
      meatPercentage?:
        | DecimalFilter<'Cattle'>
        | Decimal
        | DecimalJsLike
        | number
        | string;
      fatPercentage?:
        | DecimalFilter<'Cattle'>
        | Decimal
        | DecimalJsLike
        | number
        | string;
      purchasePricePerKg?: IntFilter<'Cattle'> | number;
      cattleClass?: EnumCattleClassFilter<'Cattle'> | $Enums.CattleClass;
      imageUrl?: StringNullableFilter<'Cattle'> | string | null;
      isSold?: BoolFilter<'Cattle'> | boolean;
      isQuarantined?: BoolFilter<'Cattle'> | boolean;
      isPregnant?: BoolFilter<'Cattle'> | boolean;
      isLactating?: BoolFilter<'Cattle'> | boolean;
      isInseminated?: BoolFilter<'Cattle'> | boolean;
      healthStatus?: EnumHealthStatusFilter<'Cattle'> | $Enums.HealthStatus;
      healthNotes?: StringNullableFilter<'Cattle'> | string | null;
      isVaccinated?: BoolFilter<'Cattle'> | boolean;
      createdAt?: DateTimeFilter<'Cattle'> | Date | string;
      updatedAt?: DateTimeFilter<'Cattle'> | Date | string;
      transactionItems?: TransactionItemListRelationFilter;
    },
    'id'
  >;

  export type CattleOrderByWithAggregationInput = {
    id?: SortOrder;
    cattleNumber?: SortOrder;
    name?: SortOrderInput | SortOrder;
    gender?: SortOrder;
    liveWeight?: SortOrder;
    meatPercentage?: SortOrder;
    fatPercentage?: SortOrder;
    purchasePricePerKg?: SortOrder;
    cattleClass?: SortOrder;
    imageUrl?: SortOrderInput | SortOrder;
    isSold?: SortOrder;
    isQuarantined?: SortOrder;
    isPregnant?: SortOrder;
    isLactating?: SortOrder;
    isInseminated?: SortOrder;
    healthStatus?: SortOrder;
    healthNotes?: SortOrderInput | SortOrder;
    isVaccinated?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: CattleCountOrderByAggregateInput;
    _avg?: CattleAvgOrderByAggregateInput;
    _max?: CattleMaxOrderByAggregateInput;
    _min?: CattleMinOrderByAggregateInput;
    _sum?: CattleSumOrderByAggregateInput;
  };

  export type CattleScalarWhereWithAggregatesInput = {
    AND?:
      | CattleScalarWhereWithAggregatesInput
      | CattleScalarWhereWithAggregatesInput[];
    OR?: CattleScalarWhereWithAggregatesInput[];
    NOT?:
      | CattleScalarWhereWithAggregatesInput
      | CattleScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Cattle'> | string;
    cattleNumber?: IntWithAggregatesFilter<'Cattle'> | number;
    name?: StringNullableWithAggregatesFilter<'Cattle'> | string | null;
    gender?: EnumGenderWithAggregatesFilter<'Cattle'> | $Enums.Gender;
    liveWeight?: IntWithAggregatesFilter<'Cattle'> | number;
    meatPercentage?:
      | DecimalWithAggregatesFilter<'Cattle'>
      | Decimal
      | DecimalJsLike
      | number
      | string;
    fatPercentage?:
      | DecimalWithAggregatesFilter<'Cattle'>
      | Decimal
      | DecimalJsLike
      | number
      | string;
    purchasePricePerKg?: IntWithAggregatesFilter<'Cattle'> | number;
    cattleClass?:
      | EnumCattleClassWithAggregatesFilter<'Cattle'>
      | $Enums.CattleClass;
    imageUrl?: StringNullableWithAggregatesFilter<'Cattle'> | string | null;
    isSold?: BoolWithAggregatesFilter<'Cattle'> | boolean;
    isQuarantined?: BoolWithAggregatesFilter<'Cattle'> | boolean;
    isPregnant?: BoolWithAggregatesFilter<'Cattle'> | boolean;
    isLactating?: BoolWithAggregatesFilter<'Cattle'> | boolean;
    isInseminated?: BoolWithAggregatesFilter<'Cattle'> | boolean;
    healthStatus?:
      | EnumHealthStatusWithAggregatesFilter<'Cattle'>
      | $Enums.HealthStatus;
    healthNotes?: StringNullableWithAggregatesFilter<'Cattle'> | string | null;
    isVaccinated?: BoolWithAggregatesFilter<'Cattle'> | boolean;
    createdAt?: DateTimeWithAggregatesFilter<'Cattle'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Cattle'> | Date | string;
  };

  export type CustomerWhereInput = {
    AND?: CustomerWhereInput | CustomerWhereInput[];
    OR?: CustomerWhereInput[];
    NOT?: CustomerWhereInput | CustomerWhereInput[];
    id?: StringFilter<'Customer'> | string;
    name?: StringFilter<'Customer'> | string;
    address?: StringFilter<'Customer'> | string;
    phone?: StringFilter<'Customer'> | string;
    createdAt?: DateTimeFilter<'Customer'> | Date | string;
    updatedAt?: DateTimeFilter<'Customer'> | Date | string;
    transactions?: TransactionListRelationFilter;
  };

  export type CustomerOrderByWithRelationInput = {
    id?: SortOrder;
    name?: SortOrder;
    address?: SortOrder;
    phone?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    transactions?: TransactionOrderByRelationAggregateInput;
  };

  export type CustomerWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: CustomerWhereInput | CustomerWhereInput[];
      OR?: CustomerWhereInput[];
      NOT?: CustomerWhereInput | CustomerWhereInput[];
      name?: StringFilter<'Customer'> | string;
      address?: StringFilter<'Customer'> | string;
      phone?: StringFilter<'Customer'> | string;
      createdAt?: DateTimeFilter<'Customer'> | Date | string;
      updatedAt?: DateTimeFilter<'Customer'> | Date | string;
      transactions?: TransactionListRelationFilter;
    },
    'id'
  >;

  export type CustomerOrderByWithAggregationInput = {
    id?: SortOrder;
    name?: SortOrder;
    address?: SortOrder;
    phone?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: CustomerCountOrderByAggregateInput;
    _max?: CustomerMaxOrderByAggregateInput;
    _min?: CustomerMinOrderByAggregateInput;
  };

  export type CustomerScalarWhereWithAggregatesInput = {
    AND?:
      | CustomerScalarWhereWithAggregatesInput
      | CustomerScalarWhereWithAggregatesInput[];
    OR?: CustomerScalarWhereWithAggregatesInput[];
    NOT?:
      | CustomerScalarWhereWithAggregatesInput
      | CustomerScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Customer'> | string;
    name?: StringWithAggregatesFilter<'Customer'> | string;
    address?: StringWithAggregatesFilter<'Customer'> | string;
    phone?: StringWithAggregatesFilter<'Customer'> | string;
    createdAt?: DateTimeWithAggregatesFilter<'Customer'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Customer'> | Date | string;
  };

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[];
    OR?: TransactionWhereInput[];
    NOT?: TransactionWhereInput | TransactionWhereInput[];
    id?: StringFilter<'Transaction'> | string;
    customerId?: StringFilter<'Transaction'> | string;
    serialNumber?: IntNullableFilter<'Transaction'> | number | null;
    remarks?: StringNullableFilter<'Transaction'> | string | null;
    createdAt?: DateTimeFilter<'Transaction'> | Date | string;
    updatedAt?: DateTimeFilter<'Transaction'> | Date | string;
    customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>;
    transactionItems?: TransactionItemListRelationFilter;
  };

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    serialNumber?: SortOrderInput | SortOrder;
    remarks?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    customer?: CustomerOrderByWithRelationInput;
    transactionItems?: TransactionItemOrderByRelationAggregateInput;
  };

  export type TransactionWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      AND?: TransactionWhereInput | TransactionWhereInput[];
      OR?: TransactionWhereInput[];
      NOT?: TransactionWhereInput | TransactionWhereInput[];
      customerId?: StringFilter<'Transaction'> | string;
      serialNumber?: IntNullableFilter<'Transaction'> | number | null;
      remarks?: StringNullableFilter<'Transaction'> | string | null;
      createdAt?: DateTimeFilter<'Transaction'> | Date | string;
      updatedAt?: DateTimeFilter<'Transaction'> | Date | string;
      customer?: XOR<CustomerScalarRelationFilter, CustomerWhereInput>;
      transactionItems?: TransactionItemListRelationFilter;
    },
    'id'
  >;

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    serialNumber?: SortOrderInput | SortOrder;
    remarks?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: TransactionCountOrderByAggregateInput;
    _avg?: TransactionAvgOrderByAggregateInput;
    _max?: TransactionMaxOrderByAggregateInput;
    _min?: TransactionMinOrderByAggregateInput;
    _sum?: TransactionSumOrderByAggregateInput;
  };

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?:
      | TransactionScalarWhereWithAggregatesInput
      | TransactionScalarWhereWithAggregatesInput[];
    OR?: TransactionScalarWhereWithAggregatesInput[];
    NOT?:
      | TransactionScalarWhereWithAggregatesInput
      | TransactionScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'Transaction'> | string;
    customerId?: StringWithAggregatesFilter<'Transaction'> | string;
    serialNumber?:
      | IntNullableWithAggregatesFilter<'Transaction'>
      | number
      | null;
    remarks?: StringNullableWithAggregatesFilter<'Transaction'> | string | null;
    createdAt?: DateTimeWithAggregatesFilter<'Transaction'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'Transaction'> | Date | string;
  };

  export type TransactionItemWhereInput = {
    AND?: TransactionItemWhereInput | TransactionItemWhereInput[];
    OR?: TransactionItemWhereInput[];
    NOT?: TransactionItemWhereInput | TransactionItemWhereInput[];
    id?: StringFilter<'TransactionItem'> | string;
    transactionId?: StringFilter<'TransactionItem'> | string;
    cattleId?: StringFilter<'TransactionItem'> | string;
    estimatedSalePrice?: IntFilter<'TransactionItem'> | number;
    actualSalePrice?: IntFilter<'TransactionItem'> | number;
    totalPrice?: IntFilter<'TransactionItem'> | number;
    paymentStatus?:
      | EnumPaymentStatusFilter<'TransactionItem'>
      | $Enums.PaymentStatus;
    paymentDate?:
      | DateTimeNullableFilter<'TransactionItem'>
      | Date
      | string
      | null;
    paymentMethod?:
      | EnumPaymentMethodNullableFilter<'TransactionItem'>
      | $Enums.PaymentMethod
      | null;
    paidAmount?: IntNullableFilter<'TransactionItem'> | number | null;
    createdAt?: DateTimeFilter<'TransactionItem'> | Date | string;
    updatedAt?: DateTimeFilter<'TransactionItem'> | Date | string;
    transaction?: XOR<TransactionScalarRelationFilter, TransactionWhereInput>;
    cattle?: XOR<CattleScalarRelationFilter, CattleWhereInput>;
  };

  export type TransactionItemOrderByWithRelationInput = {
    id?: SortOrder;
    transactionId?: SortOrder;
    cattleId?: SortOrder;
    estimatedSalePrice?: SortOrder;
    actualSalePrice?: SortOrder;
    totalPrice?: SortOrder;
    paymentStatus?: SortOrder;
    paymentDate?: SortOrderInput | SortOrder;
    paymentMethod?: SortOrderInput | SortOrder;
    paidAmount?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    transaction?: TransactionOrderByWithRelationInput;
    cattle?: CattleOrderByWithRelationInput;
  };

  export type TransactionItemWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string;
      transactionId_cattleId?: TransactionItemTransactionIdCattleIdCompoundUniqueInput;
      AND?: TransactionItemWhereInput | TransactionItemWhereInput[];
      OR?: TransactionItemWhereInput[];
      NOT?: TransactionItemWhereInput | TransactionItemWhereInput[];
      transactionId?: StringFilter<'TransactionItem'> | string;
      cattleId?: StringFilter<'TransactionItem'> | string;
      estimatedSalePrice?: IntFilter<'TransactionItem'> | number;
      actualSalePrice?: IntFilter<'TransactionItem'> | number;
      totalPrice?: IntFilter<'TransactionItem'> | number;
      paymentStatus?:
        | EnumPaymentStatusFilter<'TransactionItem'>
        | $Enums.PaymentStatus;
      paymentDate?:
        | DateTimeNullableFilter<'TransactionItem'>
        | Date
        | string
        | null;
      paymentMethod?:
        | EnumPaymentMethodNullableFilter<'TransactionItem'>
        | $Enums.PaymentMethod
        | null;
      paidAmount?: IntNullableFilter<'TransactionItem'> | number | null;
      createdAt?: DateTimeFilter<'TransactionItem'> | Date | string;
      updatedAt?: DateTimeFilter<'TransactionItem'> | Date | string;
      transaction?: XOR<TransactionScalarRelationFilter, TransactionWhereInput>;
      cattle?: XOR<CattleScalarRelationFilter, CattleWhereInput>;
    },
    'id' | 'transactionId_cattleId'
  >;

  export type TransactionItemOrderByWithAggregationInput = {
    id?: SortOrder;
    transactionId?: SortOrder;
    cattleId?: SortOrder;
    estimatedSalePrice?: SortOrder;
    actualSalePrice?: SortOrder;
    totalPrice?: SortOrder;
    paymentStatus?: SortOrder;
    paymentDate?: SortOrderInput | SortOrder;
    paymentMethod?: SortOrderInput | SortOrder;
    paidAmount?: SortOrderInput | SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
    _count?: TransactionItemCountOrderByAggregateInput;
    _avg?: TransactionItemAvgOrderByAggregateInput;
    _max?: TransactionItemMaxOrderByAggregateInput;
    _min?: TransactionItemMinOrderByAggregateInput;
    _sum?: TransactionItemSumOrderByAggregateInput;
  };

  export type TransactionItemScalarWhereWithAggregatesInput = {
    AND?:
      | TransactionItemScalarWhereWithAggregatesInput
      | TransactionItemScalarWhereWithAggregatesInput[];
    OR?: TransactionItemScalarWhereWithAggregatesInput[];
    NOT?:
      | TransactionItemScalarWhereWithAggregatesInput
      | TransactionItemScalarWhereWithAggregatesInput[];
    id?: StringWithAggregatesFilter<'TransactionItem'> | string;
    transactionId?: StringWithAggregatesFilter<'TransactionItem'> | string;
    cattleId?: StringWithAggregatesFilter<'TransactionItem'> | string;
    estimatedSalePrice?: IntWithAggregatesFilter<'TransactionItem'> | number;
    actualSalePrice?: IntWithAggregatesFilter<'TransactionItem'> | number;
    totalPrice?: IntWithAggregatesFilter<'TransactionItem'> | number;
    paymentStatus?:
      | EnumPaymentStatusWithAggregatesFilter<'TransactionItem'>
      | $Enums.PaymentStatus;
    paymentDate?:
      | DateTimeNullableWithAggregatesFilter<'TransactionItem'>
      | Date
      | string
      | null;
    paymentMethod?:
      | EnumPaymentMethodNullableWithAggregatesFilter<'TransactionItem'>
      | $Enums.PaymentMethod
      | null;
    paidAmount?:
      | IntNullableWithAggregatesFilter<'TransactionItem'>
      | number
      | null;
    createdAt?: DateTimeWithAggregatesFilter<'TransactionItem'> | Date | string;
    updatedAt?: DateTimeWithAggregatesFilter<'TransactionItem'> | Date | string;
  };

  export type CattleCreateInput = {
    id?: string;
    cattleNumber: number;
    name?: string | null;
    gender?: $Enums.Gender;
    liveWeight: number;
    meatPercentage: Decimal | DecimalJsLike | number | string;
    fatPercentage: Decimal | DecimalJsLike | number | string;
    purchasePricePerKg: number;
    cattleClass?: $Enums.CattleClass;
    imageUrl?: string | null;
    isSold?: boolean;
    isQuarantined?: boolean;
    isPregnant?: boolean;
    isLactating?: boolean;
    isInseminated?: boolean;
    healthStatus?: $Enums.HealthStatus;
    healthNotes?: string | null;
    isVaccinated?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactionItems?: TransactionItemCreateNestedManyWithoutCattleInput;
  };

  export type CattleUncheckedCreateInput = {
    id?: string;
    cattleNumber: number;
    name?: string | null;
    gender?: $Enums.Gender;
    liveWeight: number;
    meatPercentage: Decimal | DecimalJsLike | number | string;
    fatPercentage: Decimal | DecimalJsLike | number | string;
    purchasePricePerKg: number;
    cattleClass?: $Enums.CattleClass;
    imageUrl?: string | null;
    isSold?: boolean;
    isQuarantined?: boolean;
    isPregnant?: boolean;
    isLactating?: boolean;
    isInseminated?: boolean;
    healthStatus?: $Enums.HealthStatus;
    healthNotes?: string | null;
    isVaccinated?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactionItems?: TransactionItemUncheckedCreateNestedManyWithoutCattleInput;
  };

  export type CattleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    cattleNumber?: IntFieldUpdateOperationsInput | number;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender;
    liveWeight?: IntFieldUpdateOperationsInput | number;
    meatPercentage?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    fatPercentage?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    purchasePricePerKg?: IntFieldUpdateOperationsInput | number;
    cattleClass?:
      | EnumCattleClassFieldUpdateOperationsInput
      | $Enums.CattleClass;
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isSold?: BoolFieldUpdateOperationsInput | boolean;
    isQuarantined?: BoolFieldUpdateOperationsInput | boolean;
    isPregnant?: BoolFieldUpdateOperationsInput | boolean;
    isLactating?: BoolFieldUpdateOperationsInput | boolean;
    isInseminated?: BoolFieldUpdateOperationsInput | boolean;
    healthStatus?:
      | EnumHealthStatusFieldUpdateOperationsInput
      | $Enums.HealthStatus;
    healthNotes?: NullableStringFieldUpdateOperationsInput | string | null;
    isVaccinated?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    transactionItems?: TransactionItemUpdateManyWithoutCattleNestedInput;
  };

  export type CattleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    cattleNumber?: IntFieldUpdateOperationsInput | number;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender;
    liveWeight?: IntFieldUpdateOperationsInput | number;
    meatPercentage?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    fatPercentage?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    purchasePricePerKg?: IntFieldUpdateOperationsInput | number;
    cattleClass?:
      | EnumCattleClassFieldUpdateOperationsInput
      | $Enums.CattleClass;
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isSold?: BoolFieldUpdateOperationsInput | boolean;
    isQuarantined?: BoolFieldUpdateOperationsInput | boolean;
    isPregnant?: BoolFieldUpdateOperationsInput | boolean;
    isLactating?: BoolFieldUpdateOperationsInput | boolean;
    isInseminated?: BoolFieldUpdateOperationsInput | boolean;
    healthStatus?:
      | EnumHealthStatusFieldUpdateOperationsInput
      | $Enums.HealthStatus;
    healthNotes?: NullableStringFieldUpdateOperationsInput | string | null;
    isVaccinated?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    transactionItems?: TransactionItemUncheckedUpdateManyWithoutCattleNestedInput;
  };

  export type CattleCreateManyInput = {
    id?: string;
    cattleNumber: number;
    name?: string | null;
    gender?: $Enums.Gender;
    liveWeight: number;
    meatPercentage: Decimal | DecimalJsLike | number | string;
    fatPercentage: Decimal | DecimalJsLike | number | string;
    purchasePricePerKg: number;
    cattleClass?: $Enums.CattleClass;
    imageUrl?: string | null;
    isSold?: boolean;
    isQuarantined?: boolean;
    isPregnant?: boolean;
    isLactating?: boolean;
    isInseminated?: boolean;
    healthStatus?: $Enums.HealthStatus;
    healthNotes?: string | null;
    isVaccinated?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type CattleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    cattleNumber?: IntFieldUpdateOperationsInput | number;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender;
    liveWeight?: IntFieldUpdateOperationsInput | number;
    meatPercentage?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    fatPercentage?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    purchasePricePerKg?: IntFieldUpdateOperationsInput | number;
    cattleClass?:
      | EnumCattleClassFieldUpdateOperationsInput
      | $Enums.CattleClass;
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isSold?: BoolFieldUpdateOperationsInput | boolean;
    isQuarantined?: BoolFieldUpdateOperationsInput | boolean;
    isPregnant?: BoolFieldUpdateOperationsInput | boolean;
    isLactating?: BoolFieldUpdateOperationsInput | boolean;
    isInseminated?: BoolFieldUpdateOperationsInput | boolean;
    healthStatus?:
      | EnumHealthStatusFieldUpdateOperationsInput
      | $Enums.HealthStatus;
    healthNotes?: NullableStringFieldUpdateOperationsInput | string | null;
    isVaccinated?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CattleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    cattleNumber?: IntFieldUpdateOperationsInput | number;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender;
    liveWeight?: IntFieldUpdateOperationsInput | number;
    meatPercentage?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    fatPercentage?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    purchasePricePerKg?: IntFieldUpdateOperationsInput | number;
    cattleClass?:
      | EnumCattleClassFieldUpdateOperationsInput
      | $Enums.CattleClass;
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isSold?: BoolFieldUpdateOperationsInput | boolean;
    isQuarantined?: BoolFieldUpdateOperationsInput | boolean;
    isPregnant?: BoolFieldUpdateOperationsInput | boolean;
    isLactating?: BoolFieldUpdateOperationsInput | boolean;
    isInseminated?: BoolFieldUpdateOperationsInput | boolean;
    healthStatus?:
      | EnumHealthStatusFieldUpdateOperationsInput
      | $Enums.HealthStatus;
    healthNotes?: NullableStringFieldUpdateOperationsInput | string | null;
    isVaccinated?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CustomerCreateInput = {
    id?: string;
    name: string;
    address: string;
    phone: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: TransactionCreateNestedManyWithoutCustomerInput;
  };

  export type CustomerUncheckedCreateInput = {
    id?: string;
    name: string;
    address: string;
    phone: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: TransactionUncheckedCreateNestedManyWithoutCustomerInput;
  };

  export type CustomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    phone?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: TransactionUpdateManyWithoutCustomerNestedInput;
  };

  export type CustomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    phone?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: TransactionUncheckedUpdateManyWithoutCustomerNestedInput;
  };

  export type CustomerCreateManyInput = {
    id?: string;
    name: string;
    address: string;
    phone: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type CustomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    phone?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CustomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    phone?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionCreateInput = {
    id?: string;
    serialNumber?: number | null;
    remarks?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer: CustomerCreateNestedOneWithoutTransactionsInput;
    transactionItems?: TransactionItemCreateNestedManyWithoutTransactionInput;
  };

  export type TransactionUncheckedCreateInput = {
    id?: string;
    customerId: string;
    serialNumber?: number | null;
    remarks?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactionItems?: TransactionItemUncheckedCreateNestedManyWithoutTransactionInput;
  };

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    serialNumber?: NullableIntFieldUpdateOperationsInput | number | null;
    remarks?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: CustomerUpdateOneRequiredWithoutTransactionsNestedInput;
    transactionItems?: TransactionItemUpdateManyWithoutTransactionNestedInput;
  };

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    serialNumber?: NullableIntFieldUpdateOperationsInput | number | null;
    remarks?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    transactionItems?: TransactionItemUncheckedUpdateManyWithoutTransactionNestedInput;
  };

  export type TransactionCreateManyInput = {
    id?: string;
    customerId: string;
    serialNumber?: number | null;
    remarks?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    serialNumber?: NullableIntFieldUpdateOperationsInput | number | null;
    remarks?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    serialNumber?: NullableIntFieldUpdateOperationsInput | number | null;
    remarks?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionItemCreateInput = {
    id?: string;
    estimatedSalePrice: number;
    actualSalePrice: number;
    totalPrice: number;
    paymentStatus?: $Enums.PaymentStatus;
    paymentDate?: Date | string | null;
    paymentMethod?: $Enums.PaymentMethod | null;
    paidAmount?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transaction: TransactionCreateNestedOneWithoutTransactionItemsInput;
    cattle: CattleCreateNestedOneWithoutTransactionItemsInput;
  };

  export type TransactionItemUncheckedCreateInput = {
    id?: string;
    transactionId: string;
    cattleId: string;
    estimatedSalePrice: number;
    actualSalePrice: number;
    totalPrice: number;
    paymentStatus?: $Enums.PaymentStatus;
    paymentDate?: Date | string | null;
    paymentMethod?: $Enums.PaymentMethod | null;
    paidAmount?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    estimatedSalePrice?: IntFieldUpdateOperationsInput | number;
    actualSalePrice?: IntFieldUpdateOperationsInput | number;
    totalPrice?: IntFieldUpdateOperationsInput | number;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentDate?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    paymentMethod?:
      | NullableEnumPaymentMethodFieldUpdateOperationsInput
      | $Enums.PaymentMethod
      | null;
    paidAmount?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    transaction?: TransactionUpdateOneRequiredWithoutTransactionItemsNestedInput;
    cattle?: CattleUpdateOneRequiredWithoutTransactionItemsNestedInput;
  };

  export type TransactionItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string;
    transactionId?: StringFieldUpdateOperationsInput | string;
    cattleId?: StringFieldUpdateOperationsInput | string;
    estimatedSalePrice?: IntFieldUpdateOperationsInput | number;
    actualSalePrice?: IntFieldUpdateOperationsInput | number;
    totalPrice?: IntFieldUpdateOperationsInput | number;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentDate?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    paymentMethod?:
      | NullableEnumPaymentMethodFieldUpdateOperationsInput
      | $Enums.PaymentMethod
      | null;
    paidAmount?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionItemCreateManyInput = {
    id?: string;
    transactionId: string;
    cattleId: string;
    estimatedSalePrice: number;
    actualSalePrice: number;
    totalPrice: number;
    paymentStatus?: $Enums.PaymentStatus;
    paymentDate?: Date | string | null;
    paymentMethod?: $Enums.PaymentMethod | null;
    paidAmount?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string;
    estimatedSalePrice?: IntFieldUpdateOperationsInput | number;
    actualSalePrice?: IntFieldUpdateOperationsInput | number;
    totalPrice?: IntFieldUpdateOperationsInput | number;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentDate?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    paymentMethod?:
      | NullableEnumPaymentMethodFieldUpdateOperationsInput
      | $Enums.PaymentMethod
      | null;
    paidAmount?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string;
    transactionId?: StringFieldUpdateOperationsInput | string;
    cattleId?: StringFieldUpdateOperationsInput | string;
    estimatedSalePrice?: IntFieldUpdateOperationsInput | number;
    actualSalePrice?: IntFieldUpdateOperationsInput | number;
    totalPrice?: IntFieldUpdateOperationsInput | number;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentDate?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    paymentMethod?:
      | NullableEnumPaymentMethodFieldUpdateOperationsInput
      | $Enums.PaymentMethod
      | null;
    paidAmount?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type EnumGenderFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>;
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>;
    not?: NestedEnumGenderFilter<$PrismaModel> | $Enums.Gender;
  };

  export type DecimalFilter<$PrismaModel = never> = {
    equals?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    in?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    notIn?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    lt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    lte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    not?:
      | NestedDecimalFilter<$PrismaModel>
      | Decimal
      | DecimalJsLike
      | number
      | string;
  };

  export type EnumCattleClassFilter<$PrismaModel = never> = {
    equals?: $Enums.CattleClass | EnumCattleClassFieldRefInput<$PrismaModel>;
    in?: $Enums.CattleClass[] | ListEnumCattleClassFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.CattleClass[]
      | ListEnumCattleClassFieldRefInput<$PrismaModel>;
    not?: NestedEnumCattleClassFilter<$PrismaModel> | $Enums.CattleClass;
  };

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type EnumHealthStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.HealthStatus | EnumHealthStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.HealthStatus[]
      | ListEnumHealthStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.HealthStatus[]
      | ListEnumHealthStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumHealthStatusFilter<$PrismaModel> | $Enums.HealthStatus;
  };

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type TransactionItemListRelationFilter = {
    every?: TransactionItemWhereInput;
    some?: TransactionItemWhereInput;
    none?: TransactionItemWhereInput;
  };

  export type SortOrderInput = {
    sort: SortOrder;
    nulls?: NullsOrder;
  };

  export type TransactionItemOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type CattleCountOrderByAggregateInput = {
    id?: SortOrder;
    cattleNumber?: SortOrder;
    name?: SortOrder;
    gender?: SortOrder;
    liveWeight?: SortOrder;
    meatPercentage?: SortOrder;
    fatPercentage?: SortOrder;
    purchasePricePerKg?: SortOrder;
    cattleClass?: SortOrder;
    imageUrl?: SortOrder;
    isSold?: SortOrder;
    isQuarantined?: SortOrder;
    isPregnant?: SortOrder;
    isLactating?: SortOrder;
    isInseminated?: SortOrder;
    healthStatus?: SortOrder;
    healthNotes?: SortOrder;
    isVaccinated?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type CattleAvgOrderByAggregateInput = {
    cattleNumber?: SortOrder;
    liveWeight?: SortOrder;
    meatPercentage?: SortOrder;
    fatPercentage?: SortOrder;
    purchasePricePerKg?: SortOrder;
  };

  export type CattleMaxOrderByAggregateInput = {
    id?: SortOrder;
    cattleNumber?: SortOrder;
    name?: SortOrder;
    gender?: SortOrder;
    liveWeight?: SortOrder;
    meatPercentage?: SortOrder;
    fatPercentage?: SortOrder;
    purchasePricePerKg?: SortOrder;
    cattleClass?: SortOrder;
    imageUrl?: SortOrder;
    isSold?: SortOrder;
    isQuarantined?: SortOrder;
    isPregnant?: SortOrder;
    isLactating?: SortOrder;
    isInseminated?: SortOrder;
    healthStatus?: SortOrder;
    healthNotes?: SortOrder;
    isVaccinated?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type CattleMinOrderByAggregateInput = {
    id?: SortOrder;
    cattleNumber?: SortOrder;
    name?: SortOrder;
    gender?: SortOrder;
    liveWeight?: SortOrder;
    meatPercentage?: SortOrder;
    fatPercentage?: SortOrder;
    purchasePricePerKg?: SortOrder;
    cattleClass?: SortOrder;
    imageUrl?: SortOrder;
    isSold?: SortOrder;
    isQuarantined?: SortOrder;
    isPregnant?: SortOrder;
    isLactating?: SortOrder;
    isInseminated?: SortOrder;
    healthStatus?: SortOrder;
    healthNotes?: SortOrder;
    isVaccinated?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type CattleSumOrderByAggregateInput = {
    cattleNumber?: SortOrder;
    liveWeight?: SortOrder;
    meatPercentage?: SortOrder;
    fatPercentage?: SortOrder;
    purchasePricePerKg?: SortOrder;
  };

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    mode?: QueryMode;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type EnumGenderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>;
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>;
    not?: NestedEnumGenderWithAggregatesFilter<$PrismaModel> | $Enums.Gender;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumGenderFilter<$PrismaModel>;
    _max?: NestedEnumGenderFilter<$PrismaModel>;
  };

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    in?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    notIn?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    lt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    lte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    not?:
      | NestedDecimalWithAggregatesFilter<$PrismaModel>
      | Decimal
      | DecimalJsLike
      | number
      | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedDecimalFilter<$PrismaModel>;
    _sum?: NestedDecimalFilter<$PrismaModel>;
    _min?: NestedDecimalFilter<$PrismaModel>;
    _max?: NestedDecimalFilter<$PrismaModel>;
  };

  export type EnumCattleClassWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CattleClass | EnumCattleClassFieldRefInput<$PrismaModel>;
    in?: $Enums.CattleClass[] | ListEnumCattleClassFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.CattleClass[]
      | ListEnumCattleClassFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumCattleClassWithAggregatesFilter<$PrismaModel>
      | $Enums.CattleClass;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumCattleClassFilter<$PrismaModel>;
    _max?: NestedEnumCattleClassFilter<$PrismaModel>;
  };

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type EnumHealthStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HealthStatus | EnumHealthStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.HealthStatus[]
      | ListEnumHealthStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.HealthStatus[]
      | ListEnumHealthStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumHealthStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.HealthStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumHealthStatusFilter<$PrismaModel>;
    _max?: NestedEnumHealthStatusFilter<$PrismaModel>;
  };

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput;
    some?: TransactionWhereInput;
    none?: TransactionWhereInput;
  };

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder;
  };

  export type CustomerCountOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    address?: SortOrder;
    phone?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type CustomerMaxOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    address?: SortOrder;
    phone?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type CustomerMinOrderByAggregateInput = {
    id?: SortOrder;
    name?: SortOrder;
    address?: SortOrder;
    phone?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type CustomerScalarRelationFilter = {
    is?: CustomerWhereInput;
    isNot?: CustomerWhereInput;
  };

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    serialNumber?: SortOrder;
    remarks?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type TransactionAvgOrderByAggregateInput = {
    serialNumber?: SortOrder;
  };

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    serialNumber?: SortOrder;
    remarks?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder;
    customerId?: SortOrder;
    serialNumber?: SortOrder;
    remarks?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type TransactionSumOrderByAggregateInput = {
    serialNumber?: SortOrder;
  };

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type EnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.PaymentStatus
      | EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus;
  };

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type EnumPaymentMethodNullableFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.PaymentMethod
      | EnumPaymentMethodFieldRefInput<$PrismaModel>
      | null;
    in?:
      | $Enums.PaymentMethod[]
      | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
      | null;
    notIn?:
      | $Enums.PaymentMethod[]
      | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
      | null;
    not?:
      | NestedEnumPaymentMethodNullableFilter<$PrismaModel>
      | $Enums.PaymentMethod
      | null;
  };

  export type TransactionScalarRelationFilter = {
    is?: TransactionWhereInput;
    isNot?: TransactionWhereInput;
  };

  export type CattleScalarRelationFilter = {
    is?: CattleWhereInput;
    isNot?: CattleWhereInput;
  };

  export type TransactionItemTransactionIdCattleIdCompoundUniqueInput = {
    transactionId: string;
    cattleId: string;
  };

  export type TransactionItemCountOrderByAggregateInput = {
    id?: SortOrder;
    transactionId?: SortOrder;
    cattleId?: SortOrder;
    estimatedSalePrice?: SortOrder;
    actualSalePrice?: SortOrder;
    totalPrice?: SortOrder;
    paymentStatus?: SortOrder;
    paymentDate?: SortOrder;
    paymentMethod?: SortOrder;
    paidAmount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type TransactionItemAvgOrderByAggregateInput = {
    estimatedSalePrice?: SortOrder;
    actualSalePrice?: SortOrder;
    totalPrice?: SortOrder;
    paidAmount?: SortOrder;
  };

  export type TransactionItemMaxOrderByAggregateInput = {
    id?: SortOrder;
    transactionId?: SortOrder;
    cattleId?: SortOrder;
    estimatedSalePrice?: SortOrder;
    actualSalePrice?: SortOrder;
    totalPrice?: SortOrder;
    paymentStatus?: SortOrder;
    paymentDate?: SortOrder;
    paymentMethod?: SortOrder;
    paidAmount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type TransactionItemMinOrderByAggregateInput = {
    id?: SortOrder;
    transactionId?: SortOrder;
    cattleId?: SortOrder;
    estimatedSalePrice?: SortOrder;
    actualSalePrice?: SortOrder;
    totalPrice?: SortOrder;
    paymentStatus?: SortOrder;
    paymentDate?: SortOrder;
    paymentMethod?: SortOrder;
    paidAmount?: SortOrder;
    createdAt?: SortOrder;
    updatedAt?: SortOrder;
  };

  export type TransactionItemSumOrderByAggregateInput = {
    estimatedSalePrice?: SortOrder;
    actualSalePrice?: SortOrder;
    totalPrice?: SortOrder;
    paidAmount?: SortOrder;
  };

  export type EnumPaymentStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.PaymentStatus
      | EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.PaymentStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>;
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>;
  };

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?:
      | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
      | Date
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: NestedDateTimeNullableFilter<$PrismaModel>;
  };

  export type EnumPaymentMethodNullableWithAggregatesFilter<
    $PrismaModel = never
  > = {
    equals?:
      | $Enums.PaymentMethod
      | EnumPaymentMethodFieldRefInput<$PrismaModel>
      | null;
    in?:
      | $Enums.PaymentMethod[]
      | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
      | null;
    notIn?:
      | $Enums.PaymentMethod[]
      | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
      | null;
    not?:
      | NestedEnumPaymentMethodNullableWithAggregatesFilter<$PrismaModel>
      | $Enums.PaymentMethod
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>;
    _max?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>;
  };

  export type TransactionItemCreateNestedManyWithoutCattleInput = {
    create?:
      | XOR<
          TransactionItemCreateWithoutCattleInput,
          TransactionItemUncheckedCreateWithoutCattleInput
        >
      | TransactionItemCreateWithoutCattleInput[]
      | TransactionItemUncheckedCreateWithoutCattleInput[];
    connectOrCreate?:
      | TransactionItemCreateOrConnectWithoutCattleInput
      | TransactionItemCreateOrConnectWithoutCattleInput[];
    createMany?: TransactionItemCreateManyCattleInputEnvelope;
    connect?:
      | TransactionItemWhereUniqueInput
      | TransactionItemWhereUniqueInput[];
  };

  export type TransactionItemUncheckedCreateNestedManyWithoutCattleInput = {
    create?:
      | XOR<
          TransactionItemCreateWithoutCattleInput,
          TransactionItemUncheckedCreateWithoutCattleInput
        >
      | TransactionItemCreateWithoutCattleInput[]
      | TransactionItemUncheckedCreateWithoutCattleInput[];
    connectOrCreate?:
      | TransactionItemCreateOrConnectWithoutCattleInput
      | TransactionItemCreateOrConnectWithoutCattleInput[];
    createMany?: TransactionItemCreateManyCattleInputEnvelope;
    connect?:
      | TransactionItemWhereUniqueInput
      | TransactionItemWhereUniqueInput[];
  };

  export type StringFieldUpdateOperationsInput = {
    set?: string;
  };

  export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
  };

  export type EnumGenderFieldUpdateOperationsInput = {
    set?: $Enums.Gender;
  };

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string;
    increment?: Decimal | DecimalJsLike | number | string;
    decrement?: Decimal | DecimalJsLike | number | string;
    multiply?: Decimal | DecimalJsLike | number | string;
    divide?: Decimal | DecimalJsLike | number | string;
  };

  export type EnumCattleClassFieldUpdateOperationsInput = {
    set?: $Enums.CattleClass;
  };

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
  };

  export type EnumHealthStatusFieldUpdateOperationsInput = {
    set?: $Enums.HealthStatus;
  };

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
  };

  export type TransactionItemUpdateManyWithoutCattleNestedInput = {
    create?:
      | XOR<
          TransactionItemCreateWithoutCattleInput,
          TransactionItemUncheckedCreateWithoutCattleInput
        >
      | TransactionItemCreateWithoutCattleInput[]
      | TransactionItemUncheckedCreateWithoutCattleInput[];
    connectOrCreate?:
      | TransactionItemCreateOrConnectWithoutCattleInput
      | TransactionItemCreateOrConnectWithoutCattleInput[];
    upsert?:
      | TransactionItemUpsertWithWhereUniqueWithoutCattleInput
      | TransactionItemUpsertWithWhereUniqueWithoutCattleInput[];
    createMany?: TransactionItemCreateManyCattleInputEnvelope;
    set?: TransactionItemWhereUniqueInput | TransactionItemWhereUniqueInput[];
    disconnect?:
      | TransactionItemWhereUniqueInput
      | TransactionItemWhereUniqueInput[];
    delete?:
      | TransactionItemWhereUniqueInput
      | TransactionItemWhereUniqueInput[];
    connect?:
      | TransactionItemWhereUniqueInput
      | TransactionItemWhereUniqueInput[];
    update?:
      | TransactionItemUpdateWithWhereUniqueWithoutCattleInput
      | TransactionItemUpdateWithWhereUniqueWithoutCattleInput[];
    updateMany?:
      | TransactionItemUpdateManyWithWhereWithoutCattleInput
      | TransactionItemUpdateManyWithWhereWithoutCattleInput[];
    deleteMany?:
      | TransactionItemScalarWhereInput
      | TransactionItemScalarWhereInput[];
  };

  export type TransactionItemUncheckedUpdateManyWithoutCattleNestedInput = {
    create?:
      | XOR<
          TransactionItemCreateWithoutCattleInput,
          TransactionItemUncheckedCreateWithoutCattleInput
        >
      | TransactionItemCreateWithoutCattleInput[]
      | TransactionItemUncheckedCreateWithoutCattleInput[];
    connectOrCreate?:
      | TransactionItemCreateOrConnectWithoutCattleInput
      | TransactionItemCreateOrConnectWithoutCattleInput[];
    upsert?:
      | TransactionItemUpsertWithWhereUniqueWithoutCattleInput
      | TransactionItemUpsertWithWhereUniqueWithoutCattleInput[];
    createMany?: TransactionItemCreateManyCattleInputEnvelope;
    set?: TransactionItemWhereUniqueInput | TransactionItemWhereUniqueInput[];
    disconnect?:
      | TransactionItemWhereUniqueInput
      | TransactionItemWhereUniqueInput[];
    delete?:
      | TransactionItemWhereUniqueInput
      | TransactionItemWhereUniqueInput[];
    connect?:
      | TransactionItemWhereUniqueInput
      | TransactionItemWhereUniqueInput[];
    update?:
      | TransactionItemUpdateWithWhereUniqueWithoutCattleInput
      | TransactionItemUpdateWithWhereUniqueWithoutCattleInput[];
    updateMany?:
      | TransactionItemUpdateManyWithWhereWithoutCattleInput
      | TransactionItemUpdateManyWithWhereWithoutCattleInput[];
    deleteMany?:
      | TransactionItemScalarWhereInput
      | TransactionItemScalarWhereInput[];
  };

  export type TransactionCreateNestedManyWithoutCustomerInput = {
    create?:
      | XOR<
          TransactionCreateWithoutCustomerInput,
          TransactionUncheckedCreateWithoutCustomerInput
        >
      | TransactionCreateWithoutCustomerInput[]
      | TransactionUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutCustomerInput
      | TransactionCreateOrConnectWithoutCustomerInput[];
    createMany?: TransactionCreateManyCustomerInputEnvelope;
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
  };

  export type TransactionUncheckedCreateNestedManyWithoutCustomerInput = {
    create?:
      | XOR<
          TransactionCreateWithoutCustomerInput,
          TransactionUncheckedCreateWithoutCustomerInput
        >
      | TransactionCreateWithoutCustomerInput[]
      | TransactionUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutCustomerInput
      | TransactionCreateOrConnectWithoutCustomerInput[];
    createMany?: TransactionCreateManyCustomerInputEnvelope;
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
  };

  export type TransactionUpdateManyWithoutCustomerNestedInput = {
    create?:
      | XOR<
          TransactionCreateWithoutCustomerInput,
          TransactionUncheckedCreateWithoutCustomerInput
        >
      | TransactionCreateWithoutCustomerInput[]
      | TransactionUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutCustomerInput
      | TransactionCreateOrConnectWithoutCustomerInput[];
    upsert?:
      | TransactionUpsertWithWhereUniqueWithoutCustomerInput
      | TransactionUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: TransactionCreateManyCustomerInputEnvelope;
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    update?:
      | TransactionUpdateWithWhereUniqueWithoutCustomerInput
      | TransactionUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?:
      | TransactionUpdateManyWithWhereWithoutCustomerInput
      | TransactionUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[];
  };

  export type TransactionUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?:
      | XOR<
          TransactionCreateWithoutCustomerInput,
          TransactionUncheckedCreateWithoutCustomerInput
        >
      | TransactionCreateWithoutCustomerInput[]
      | TransactionUncheckedCreateWithoutCustomerInput[];
    connectOrCreate?:
      | TransactionCreateOrConnectWithoutCustomerInput
      | TransactionCreateOrConnectWithoutCustomerInput[];
    upsert?:
      | TransactionUpsertWithWhereUniqueWithoutCustomerInput
      | TransactionUpsertWithWhereUniqueWithoutCustomerInput[];
    createMany?: TransactionCreateManyCustomerInputEnvelope;
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[];
    update?:
      | TransactionUpdateWithWhereUniqueWithoutCustomerInput
      | TransactionUpdateWithWhereUniqueWithoutCustomerInput[];
    updateMany?:
      | TransactionUpdateManyWithWhereWithoutCustomerInput
      | TransactionUpdateManyWithWhereWithoutCustomerInput[];
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[];
  };

  export type CustomerCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<
      CustomerCreateWithoutTransactionsInput,
      CustomerUncheckedCreateWithoutTransactionsInput
    >;
    connectOrCreate?: CustomerCreateOrConnectWithoutTransactionsInput;
    connect?: CustomerWhereUniqueInput;
  };

  export type TransactionItemCreateNestedManyWithoutTransactionInput = {
    create?:
      | XOR<
          TransactionItemCreateWithoutTransactionInput,
          TransactionItemUncheckedCreateWithoutTransactionInput
        >
      | TransactionItemCreateWithoutTransactionInput[]
      | TransactionItemUncheckedCreateWithoutTransactionInput[];
    connectOrCreate?:
      | TransactionItemCreateOrConnectWithoutTransactionInput
      | TransactionItemCreateOrConnectWithoutTransactionInput[];
    createMany?: TransactionItemCreateManyTransactionInputEnvelope;
    connect?:
      | TransactionItemWhereUniqueInput
      | TransactionItemWhereUniqueInput[];
  };

  export type TransactionItemUncheckedCreateNestedManyWithoutTransactionInput =
    {
      create?:
        | XOR<
            TransactionItemCreateWithoutTransactionInput,
            TransactionItemUncheckedCreateWithoutTransactionInput
          >
        | TransactionItemCreateWithoutTransactionInput[]
        | TransactionItemUncheckedCreateWithoutTransactionInput[];
      connectOrCreate?:
        | TransactionItemCreateOrConnectWithoutTransactionInput
        | TransactionItemCreateOrConnectWithoutTransactionInput[];
      createMany?: TransactionItemCreateManyTransactionInputEnvelope;
      connect?:
        | TransactionItemWhereUniqueInput
        | TransactionItemWhereUniqueInput[];
    };

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
  };

  export type CustomerUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<
      CustomerCreateWithoutTransactionsInput,
      CustomerUncheckedCreateWithoutTransactionsInput
    >;
    connectOrCreate?: CustomerCreateOrConnectWithoutTransactionsInput;
    upsert?: CustomerUpsertWithoutTransactionsInput;
    connect?: CustomerWhereUniqueInput;
    update?: XOR<
      XOR<
        CustomerUpdateToOneWithWhereWithoutTransactionsInput,
        CustomerUpdateWithoutTransactionsInput
      >,
      CustomerUncheckedUpdateWithoutTransactionsInput
    >;
  };

  export type TransactionItemUpdateManyWithoutTransactionNestedInput = {
    create?:
      | XOR<
          TransactionItemCreateWithoutTransactionInput,
          TransactionItemUncheckedCreateWithoutTransactionInput
        >
      | TransactionItemCreateWithoutTransactionInput[]
      | TransactionItemUncheckedCreateWithoutTransactionInput[];
    connectOrCreate?:
      | TransactionItemCreateOrConnectWithoutTransactionInput
      | TransactionItemCreateOrConnectWithoutTransactionInput[];
    upsert?:
      | TransactionItemUpsertWithWhereUniqueWithoutTransactionInput
      | TransactionItemUpsertWithWhereUniqueWithoutTransactionInput[];
    createMany?: TransactionItemCreateManyTransactionInputEnvelope;
    set?: TransactionItemWhereUniqueInput | TransactionItemWhereUniqueInput[];
    disconnect?:
      | TransactionItemWhereUniqueInput
      | TransactionItemWhereUniqueInput[];
    delete?:
      | TransactionItemWhereUniqueInput
      | TransactionItemWhereUniqueInput[];
    connect?:
      | TransactionItemWhereUniqueInput
      | TransactionItemWhereUniqueInput[];
    update?:
      | TransactionItemUpdateWithWhereUniqueWithoutTransactionInput
      | TransactionItemUpdateWithWhereUniqueWithoutTransactionInput[];
    updateMany?:
      | TransactionItemUpdateManyWithWhereWithoutTransactionInput
      | TransactionItemUpdateManyWithWhereWithoutTransactionInput[];
    deleteMany?:
      | TransactionItemScalarWhereInput
      | TransactionItemScalarWhereInput[];
  };

  export type TransactionItemUncheckedUpdateManyWithoutTransactionNestedInput =
    {
      create?:
        | XOR<
            TransactionItemCreateWithoutTransactionInput,
            TransactionItemUncheckedCreateWithoutTransactionInput
          >
        | TransactionItemCreateWithoutTransactionInput[]
        | TransactionItemUncheckedCreateWithoutTransactionInput[];
      connectOrCreate?:
        | TransactionItemCreateOrConnectWithoutTransactionInput
        | TransactionItemCreateOrConnectWithoutTransactionInput[];
      upsert?:
        | TransactionItemUpsertWithWhereUniqueWithoutTransactionInput
        | TransactionItemUpsertWithWhereUniqueWithoutTransactionInput[];
      createMany?: TransactionItemCreateManyTransactionInputEnvelope;
      set?: TransactionItemWhereUniqueInput | TransactionItemWhereUniqueInput[];
      disconnect?:
        | TransactionItemWhereUniqueInput
        | TransactionItemWhereUniqueInput[];
      delete?:
        | TransactionItemWhereUniqueInput
        | TransactionItemWhereUniqueInput[];
      connect?:
        | TransactionItemWhereUniqueInput
        | TransactionItemWhereUniqueInput[];
      update?:
        | TransactionItemUpdateWithWhereUniqueWithoutTransactionInput
        | TransactionItemUpdateWithWhereUniqueWithoutTransactionInput[];
      updateMany?:
        | TransactionItemUpdateManyWithWhereWithoutTransactionInput
        | TransactionItemUpdateManyWithWhereWithoutTransactionInput[];
      deleteMany?:
        | TransactionItemScalarWhereInput
        | TransactionItemScalarWhereInput[];
    };

  export type TransactionCreateNestedOneWithoutTransactionItemsInput = {
    create?: XOR<
      TransactionCreateWithoutTransactionItemsInput,
      TransactionUncheckedCreateWithoutTransactionItemsInput
    >;
    connectOrCreate?: TransactionCreateOrConnectWithoutTransactionItemsInput;
    connect?: TransactionWhereUniqueInput;
  };

  export type CattleCreateNestedOneWithoutTransactionItemsInput = {
    create?: XOR<
      CattleCreateWithoutTransactionItemsInput,
      CattleUncheckedCreateWithoutTransactionItemsInput
    >;
    connectOrCreate?: CattleCreateOrConnectWithoutTransactionItemsInput;
    connect?: CattleWhereUniqueInput;
  };

  export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus;
  };

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
  };

  export type NullableEnumPaymentMethodFieldUpdateOperationsInput = {
    set?: $Enums.PaymentMethod | null;
  };

  export type TransactionUpdateOneRequiredWithoutTransactionItemsNestedInput = {
    create?: XOR<
      TransactionCreateWithoutTransactionItemsInput,
      TransactionUncheckedCreateWithoutTransactionItemsInput
    >;
    connectOrCreate?: TransactionCreateOrConnectWithoutTransactionItemsInput;
    upsert?: TransactionUpsertWithoutTransactionItemsInput;
    connect?: TransactionWhereUniqueInput;
    update?: XOR<
      XOR<
        TransactionUpdateToOneWithWhereWithoutTransactionItemsInput,
        TransactionUpdateWithoutTransactionItemsInput
      >,
      TransactionUncheckedUpdateWithoutTransactionItemsInput
    >;
  };

  export type CattleUpdateOneRequiredWithoutTransactionItemsNestedInput = {
    create?: XOR<
      CattleCreateWithoutTransactionItemsInput,
      CattleUncheckedCreateWithoutTransactionItemsInput
    >;
    connectOrCreate?: CattleCreateOrConnectWithoutTransactionItemsInput;
    upsert?: CattleUpsertWithoutTransactionItemsInput;
    connect?: CattleWhereUniqueInput;
    update?: XOR<
      XOR<
        CattleUpdateToOneWithWhereWithoutTransactionItemsInput,
        CattleUpdateWithoutTransactionItemsInput
      >,
      CattleUncheckedUpdateWithoutTransactionItemsInput
    >;
  };

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringFilter<$PrismaModel> | string;
  };

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntFilter<$PrismaModel> | number;
  };

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringNullableFilter<$PrismaModel> | string | null;
  };

  export type NestedEnumGenderFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>;
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>;
    not?: NestedEnumGenderFilter<$PrismaModel> | $Enums.Gender;
  };

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    in?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    notIn?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    lt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    lte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    not?:
      | NestedDecimalFilter<$PrismaModel>
      | Decimal
      | DecimalJsLike
      | number
      | string;
  };

  export type NestedEnumCattleClassFilter<$PrismaModel = never> = {
    equals?: $Enums.CattleClass | EnumCattleClassFieldRefInput<$PrismaModel>;
    in?: $Enums.CattleClass[] | ListEnumCattleClassFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.CattleClass[]
      | ListEnumCattleClassFieldRefInput<$PrismaModel>;
    not?: NestedEnumCattleClassFilter<$PrismaModel> | $Enums.CattleClass;
  };

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolFilter<$PrismaModel> | boolean;
  };

  export type NestedEnumHealthStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.HealthStatus | EnumHealthStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.HealthStatus[]
      | ListEnumHealthStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.HealthStatus[]
      | ListEnumHealthStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumHealthStatusFilter<$PrismaModel> | $Enums.HealthStatus;
  };

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
  };

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>;
    in?: string[] | ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedStringFilter<$PrismaModel>;
    _max?: NestedStringFilter<$PrismaModel>;
  };

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>;
    in?: number[] | ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedFloatFilter<$PrismaModel>;
    _sum?: NestedIntFilter<$PrismaModel>;
    _min?: NestedIntFilter<$PrismaModel>;
    _max?: NestedIntFilter<$PrismaModel>;
  };

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatFilter<$PrismaModel> | number;
  };

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | StringFieldRefInput<$PrismaModel>;
    lte?: string | StringFieldRefInput<$PrismaModel>;
    gt?: string | StringFieldRefInput<$PrismaModel>;
    gte?: string | StringFieldRefInput<$PrismaModel>;
    contains?: string | StringFieldRefInput<$PrismaModel>;
    startsWith?: string | StringFieldRefInput<$PrismaModel>;
    endsWith?: string | StringFieldRefInput<$PrismaModel>;
    not?:
      | NestedStringNullableWithAggregatesFilter<$PrismaModel>
      | string
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedStringNullableFilter<$PrismaModel>;
    _max?: NestedStringNullableFilter<$PrismaModel>;
  };

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedEnumGenderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Gender | EnumGenderFieldRefInput<$PrismaModel>;
    in?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Gender[] | ListEnumGenderFieldRefInput<$PrismaModel>;
    not?: NestedEnumGenderWithAggregatesFilter<$PrismaModel> | $Enums.Gender;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumGenderFilter<$PrismaModel>;
    _max?: NestedEnumGenderFilter<$PrismaModel>;
  };

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    in?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    notIn?:
      | Decimal[]
      | DecimalJsLike[]
      | number[]
      | string[]
      | ListDecimalFieldRefInput<$PrismaModel>;
    lt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    lte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gt?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    gte?:
      | Decimal
      | DecimalJsLike
      | number
      | string
      | DecimalFieldRefInput<$PrismaModel>;
    not?:
      | NestedDecimalWithAggregatesFilter<$PrismaModel>
      | Decimal
      | DecimalJsLike
      | number
      | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _avg?: NestedDecimalFilter<$PrismaModel>;
    _sum?: NestedDecimalFilter<$PrismaModel>;
    _min?: NestedDecimalFilter<$PrismaModel>;
    _max?: NestedDecimalFilter<$PrismaModel>;
  };

  export type NestedEnumCattleClassWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?: $Enums.CattleClass | EnumCattleClassFieldRefInput<$PrismaModel>;
      in?:
        | $Enums.CattleClass[]
        | ListEnumCattleClassFieldRefInput<$PrismaModel>;
      notIn?:
        | $Enums.CattleClass[]
        | ListEnumCattleClassFieldRefInput<$PrismaModel>;
      not?:
        | NestedEnumCattleClassWithAggregatesFilter<$PrismaModel>
        | $Enums.CattleClass;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedEnumCattleClassFilter<$PrismaModel>;
      _max?: NestedEnumCattleClassFilter<$PrismaModel>;
    };

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedBoolFilter<$PrismaModel>;
    _max?: NestedBoolFilter<$PrismaModel>;
  };

  export type NestedEnumHealthStatusWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?:
        | $Enums.HealthStatus
        | EnumHealthStatusFieldRefInput<$PrismaModel>;
      in?:
        | $Enums.HealthStatus[]
        | ListEnumHealthStatusFieldRefInput<$PrismaModel>;
      notIn?:
        | $Enums.HealthStatus[]
        | ListEnumHealthStatusFieldRefInput<$PrismaModel>;
      not?:
        | NestedEnumHealthStatusWithAggregatesFilter<$PrismaModel>
        | $Enums.HealthStatus;
      _count?: NestedIntFilter<$PrismaModel>;
      _min?: NestedEnumHealthStatusFilter<$PrismaModel>;
      _max?: NestedEnumHealthStatusFilter<$PrismaModel>;
    };

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedDateTimeFilter<$PrismaModel>;
    _max?: NestedDateTimeFilter<$PrismaModel>;
  };

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | IntFieldRefInput<$PrismaModel>;
    lte?: number | IntFieldRefInput<$PrismaModel>;
    gt?: number | IntFieldRefInput<$PrismaModel>;
    gte?: number | IntFieldRefInput<$PrismaModel>;
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _avg?: NestedFloatNullableFilter<$PrismaModel>;
    _sum?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedIntNullableFilter<$PrismaModel>;
    _max?: NestedIntNullableFilter<$PrismaModel>;
  };

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | FloatFieldRefInput<$PrismaModel>;
    lte?: number | FloatFieldRefInput<$PrismaModel>;
    gt?: number | FloatFieldRefInput<$PrismaModel>;
    gte?: number | FloatFieldRefInput<$PrismaModel>;
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
  };

  export type NestedEnumPaymentStatusFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.PaymentStatus
      | EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?: NestedEnumPaymentStatusFilter<$PrismaModel> | $Enums.PaymentStatus;
  };

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
  };

  export type NestedEnumPaymentMethodNullableFilter<$PrismaModel = never> = {
    equals?:
      | $Enums.PaymentMethod
      | EnumPaymentMethodFieldRefInput<$PrismaModel>
      | null;
    in?:
      | $Enums.PaymentMethod[]
      | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
      | null;
    notIn?:
      | $Enums.PaymentMethod[]
      | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
      | null;
    not?:
      | NestedEnumPaymentMethodNullableFilter<$PrismaModel>
      | $Enums.PaymentMethod
      | null;
  };

  export type NestedEnumPaymentStatusWithAggregatesFilter<
    $PrismaModel = never
  > = {
    equals?:
      | $Enums.PaymentStatus
      | EnumPaymentStatusFieldRefInput<$PrismaModel>;
    in?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    notIn?:
      | $Enums.PaymentStatus[]
      | ListEnumPaymentStatusFieldRefInput<$PrismaModel>;
    not?:
      | NestedEnumPaymentStatusWithAggregatesFilter<$PrismaModel>
      | $Enums.PaymentStatus;
    _count?: NestedIntFilter<$PrismaModel>;
    _min?: NestedEnumPaymentStatusFilter<$PrismaModel>;
    _max?: NestedEnumPaymentStatusFilter<$PrismaModel>;
  };

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> =
    {
      equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
      in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
      notIn?:
        | Date[]
        | string[]
        | ListDateTimeFieldRefInput<$PrismaModel>
        | null;
      lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
      not?:
        | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
        | Date
        | string
        | null;
      _count?: NestedIntNullableFilter<$PrismaModel>;
      _min?: NestedDateTimeNullableFilter<$PrismaModel>;
      _max?: NestedDateTimeNullableFilter<$PrismaModel>;
    };

  export type NestedEnumPaymentMethodNullableWithAggregatesFilter<
    $PrismaModel = never
  > = {
    equals?:
      | $Enums.PaymentMethod
      | EnumPaymentMethodFieldRefInput<$PrismaModel>
      | null;
    in?:
      | $Enums.PaymentMethod[]
      | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
      | null;
    notIn?:
      | $Enums.PaymentMethod[]
      | ListEnumPaymentMethodFieldRefInput<$PrismaModel>
      | null;
    not?:
      | NestedEnumPaymentMethodNullableWithAggregatesFilter<$PrismaModel>
      | $Enums.PaymentMethod
      | null;
    _count?: NestedIntNullableFilter<$PrismaModel>;
    _min?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>;
    _max?: NestedEnumPaymentMethodNullableFilter<$PrismaModel>;
  };

  export type TransactionItemCreateWithoutCattleInput = {
    id?: string;
    estimatedSalePrice: number;
    actualSalePrice: number;
    totalPrice: number;
    paymentStatus?: $Enums.PaymentStatus;
    paymentDate?: Date | string | null;
    paymentMethod?: $Enums.PaymentMethod | null;
    paidAmount?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transaction: TransactionCreateNestedOneWithoutTransactionItemsInput;
  };

  export type TransactionItemUncheckedCreateWithoutCattleInput = {
    id?: string;
    transactionId: string;
    estimatedSalePrice: number;
    actualSalePrice: number;
    totalPrice: number;
    paymentStatus?: $Enums.PaymentStatus;
    paymentDate?: Date | string | null;
    paymentMethod?: $Enums.PaymentMethod | null;
    paidAmount?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionItemCreateOrConnectWithoutCattleInput = {
    where: TransactionItemWhereUniqueInput;
    create: XOR<
      TransactionItemCreateWithoutCattleInput,
      TransactionItemUncheckedCreateWithoutCattleInput
    >;
  };

  export type TransactionItemCreateManyCattleInputEnvelope = {
    data:
      | TransactionItemCreateManyCattleInput
      | TransactionItemCreateManyCattleInput[];
    skipDuplicates?: boolean;
  };

  export type TransactionItemUpsertWithWhereUniqueWithoutCattleInput = {
    where: TransactionItemWhereUniqueInput;
    update: XOR<
      TransactionItemUpdateWithoutCattleInput,
      TransactionItemUncheckedUpdateWithoutCattleInput
    >;
    create: XOR<
      TransactionItemCreateWithoutCattleInput,
      TransactionItemUncheckedCreateWithoutCattleInput
    >;
  };

  export type TransactionItemUpdateWithWhereUniqueWithoutCattleInput = {
    where: TransactionItemWhereUniqueInput;
    data: XOR<
      TransactionItemUpdateWithoutCattleInput,
      TransactionItemUncheckedUpdateWithoutCattleInput
    >;
  };

  export type TransactionItemUpdateManyWithWhereWithoutCattleInput = {
    where: TransactionItemScalarWhereInput;
    data: XOR<
      TransactionItemUpdateManyMutationInput,
      TransactionItemUncheckedUpdateManyWithoutCattleInput
    >;
  };

  export type TransactionItemScalarWhereInput = {
    AND?: TransactionItemScalarWhereInput | TransactionItemScalarWhereInput[];
    OR?: TransactionItemScalarWhereInput[];
    NOT?: TransactionItemScalarWhereInput | TransactionItemScalarWhereInput[];
    id?: StringFilter<'TransactionItem'> | string;
    transactionId?: StringFilter<'TransactionItem'> | string;
    cattleId?: StringFilter<'TransactionItem'> | string;
    estimatedSalePrice?: IntFilter<'TransactionItem'> | number;
    actualSalePrice?: IntFilter<'TransactionItem'> | number;
    totalPrice?: IntFilter<'TransactionItem'> | number;
    paymentStatus?:
      | EnumPaymentStatusFilter<'TransactionItem'>
      | $Enums.PaymentStatus;
    paymentDate?:
      | DateTimeNullableFilter<'TransactionItem'>
      | Date
      | string
      | null;
    paymentMethod?:
      | EnumPaymentMethodNullableFilter<'TransactionItem'>
      | $Enums.PaymentMethod
      | null;
    paidAmount?: IntNullableFilter<'TransactionItem'> | number | null;
    createdAt?: DateTimeFilter<'TransactionItem'> | Date | string;
    updatedAt?: DateTimeFilter<'TransactionItem'> | Date | string;
  };

  export type TransactionCreateWithoutCustomerInput = {
    id?: string;
    serialNumber?: number | null;
    remarks?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactionItems?: TransactionItemCreateNestedManyWithoutTransactionInput;
  };

  export type TransactionUncheckedCreateWithoutCustomerInput = {
    id?: string;
    serialNumber?: number | null;
    remarks?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactionItems?: TransactionItemUncheckedCreateNestedManyWithoutTransactionInput;
  };

  export type TransactionCreateOrConnectWithoutCustomerInput = {
    where: TransactionWhereUniqueInput;
    create: XOR<
      TransactionCreateWithoutCustomerInput,
      TransactionUncheckedCreateWithoutCustomerInput
    >;
  };

  export type TransactionCreateManyCustomerInputEnvelope = {
    data:
      | TransactionCreateManyCustomerInput
      | TransactionCreateManyCustomerInput[];
    skipDuplicates?: boolean;
  };

  export type TransactionUpsertWithWhereUniqueWithoutCustomerInput = {
    where: TransactionWhereUniqueInput;
    update: XOR<
      TransactionUpdateWithoutCustomerInput,
      TransactionUncheckedUpdateWithoutCustomerInput
    >;
    create: XOR<
      TransactionCreateWithoutCustomerInput,
      TransactionUncheckedCreateWithoutCustomerInput
    >;
  };

  export type TransactionUpdateWithWhereUniqueWithoutCustomerInput = {
    where: TransactionWhereUniqueInput;
    data: XOR<
      TransactionUpdateWithoutCustomerInput,
      TransactionUncheckedUpdateWithoutCustomerInput
    >;
  };

  export type TransactionUpdateManyWithWhereWithoutCustomerInput = {
    where: TransactionScalarWhereInput;
    data: XOR<
      TransactionUpdateManyMutationInput,
      TransactionUncheckedUpdateManyWithoutCustomerInput
    >;
  };

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[];
    OR?: TransactionScalarWhereInput[];
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[];
    id?: StringFilter<'Transaction'> | string;
    customerId?: StringFilter<'Transaction'> | string;
    serialNumber?: IntNullableFilter<'Transaction'> | number | null;
    remarks?: StringNullableFilter<'Transaction'> | string | null;
    createdAt?: DateTimeFilter<'Transaction'> | Date | string;
    updatedAt?: DateTimeFilter<'Transaction'> | Date | string;
  };

  export type CustomerCreateWithoutTransactionsInput = {
    id?: string;
    name: string;
    address: string;
    phone: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type CustomerUncheckedCreateWithoutTransactionsInput = {
    id?: string;
    name: string;
    address: string;
    phone: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type CustomerCreateOrConnectWithoutTransactionsInput = {
    where: CustomerWhereUniqueInput;
    create: XOR<
      CustomerCreateWithoutTransactionsInput,
      CustomerUncheckedCreateWithoutTransactionsInput
    >;
  };

  export type TransactionItemCreateWithoutTransactionInput = {
    id?: string;
    estimatedSalePrice: number;
    actualSalePrice: number;
    totalPrice: number;
    paymentStatus?: $Enums.PaymentStatus;
    paymentDate?: Date | string | null;
    paymentMethod?: $Enums.PaymentMethod | null;
    paidAmount?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    cattle: CattleCreateNestedOneWithoutTransactionItemsInput;
  };

  export type TransactionItemUncheckedCreateWithoutTransactionInput = {
    id?: string;
    cattleId: string;
    estimatedSalePrice: number;
    actualSalePrice: number;
    totalPrice: number;
    paymentStatus?: $Enums.PaymentStatus;
    paymentDate?: Date | string | null;
    paymentMethod?: $Enums.PaymentMethod | null;
    paidAmount?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionItemCreateOrConnectWithoutTransactionInput = {
    where: TransactionItemWhereUniqueInput;
    create: XOR<
      TransactionItemCreateWithoutTransactionInput,
      TransactionItemUncheckedCreateWithoutTransactionInput
    >;
  };

  export type TransactionItemCreateManyTransactionInputEnvelope = {
    data:
      | TransactionItemCreateManyTransactionInput
      | TransactionItemCreateManyTransactionInput[];
    skipDuplicates?: boolean;
  };

  export type CustomerUpsertWithoutTransactionsInput = {
    update: XOR<
      CustomerUpdateWithoutTransactionsInput,
      CustomerUncheckedUpdateWithoutTransactionsInput
    >;
    create: XOR<
      CustomerCreateWithoutTransactionsInput,
      CustomerUncheckedCreateWithoutTransactionsInput
    >;
    where?: CustomerWhereInput;
  };

  export type CustomerUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: CustomerWhereInput;
    data: XOR<
      CustomerUpdateWithoutTransactionsInput,
      CustomerUncheckedUpdateWithoutTransactionsInput
    >;
  };

  export type CustomerUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    phone?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CustomerUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    name?: StringFieldUpdateOperationsInput | string;
    address?: StringFieldUpdateOperationsInput | string;
    phone?: StringFieldUpdateOperationsInput | string;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionItemUpsertWithWhereUniqueWithoutTransactionInput = {
    where: TransactionItemWhereUniqueInput;
    update: XOR<
      TransactionItemUpdateWithoutTransactionInput,
      TransactionItemUncheckedUpdateWithoutTransactionInput
    >;
    create: XOR<
      TransactionItemCreateWithoutTransactionInput,
      TransactionItemUncheckedCreateWithoutTransactionInput
    >;
  };

  export type TransactionItemUpdateWithWhereUniqueWithoutTransactionInput = {
    where: TransactionItemWhereUniqueInput;
    data: XOR<
      TransactionItemUpdateWithoutTransactionInput,
      TransactionItemUncheckedUpdateWithoutTransactionInput
    >;
  };

  export type TransactionItemUpdateManyWithWhereWithoutTransactionInput = {
    where: TransactionItemScalarWhereInput;
    data: XOR<
      TransactionItemUpdateManyMutationInput,
      TransactionItemUncheckedUpdateManyWithoutTransactionInput
    >;
  };

  export type TransactionCreateWithoutTransactionItemsInput = {
    id?: string;
    serialNumber?: number | null;
    remarks?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    customer: CustomerCreateNestedOneWithoutTransactionsInput;
  };

  export type TransactionUncheckedCreateWithoutTransactionItemsInput = {
    id?: string;
    customerId: string;
    serialNumber?: number | null;
    remarks?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionCreateOrConnectWithoutTransactionItemsInput = {
    where: TransactionWhereUniqueInput;
    create: XOR<
      TransactionCreateWithoutTransactionItemsInput,
      TransactionUncheckedCreateWithoutTransactionItemsInput
    >;
  };

  export type CattleCreateWithoutTransactionItemsInput = {
    id?: string;
    cattleNumber: number;
    name?: string | null;
    gender?: $Enums.Gender;
    liveWeight: number;
    meatPercentage: Decimal | DecimalJsLike | number | string;
    fatPercentage: Decimal | DecimalJsLike | number | string;
    purchasePricePerKg: number;
    cattleClass?: $Enums.CattleClass;
    imageUrl?: string | null;
    isSold?: boolean;
    isQuarantined?: boolean;
    isPregnant?: boolean;
    isLactating?: boolean;
    isInseminated?: boolean;
    healthStatus?: $Enums.HealthStatus;
    healthNotes?: string | null;
    isVaccinated?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type CattleUncheckedCreateWithoutTransactionItemsInput = {
    id?: string;
    cattleNumber: number;
    name?: string | null;
    gender?: $Enums.Gender;
    liveWeight: number;
    meatPercentage: Decimal | DecimalJsLike | number | string;
    fatPercentage: Decimal | DecimalJsLike | number | string;
    purchasePricePerKg: number;
    cattleClass?: $Enums.CattleClass;
    imageUrl?: string | null;
    isSold?: boolean;
    isQuarantined?: boolean;
    isPregnant?: boolean;
    isLactating?: boolean;
    isInseminated?: boolean;
    healthStatus?: $Enums.HealthStatus;
    healthNotes?: string | null;
    isVaccinated?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type CattleCreateOrConnectWithoutTransactionItemsInput = {
    where: CattleWhereUniqueInput;
    create: XOR<
      CattleCreateWithoutTransactionItemsInput,
      CattleUncheckedCreateWithoutTransactionItemsInput
    >;
  };

  export type TransactionUpsertWithoutTransactionItemsInput = {
    update: XOR<
      TransactionUpdateWithoutTransactionItemsInput,
      TransactionUncheckedUpdateWithoutTransactionItemsInput
    >;
    create: XOR<
      TransactionCreateWithoutTransactionItemsInput,
      TransactionUncheckedCreateWithoutTransactionItemsInput
    >;
    where?: TransactionWhereInput;
  };

  export type TransactionUpdateToOneWithWhereWithoutTransactionItemsInput = {
    where?: TransactionWhereInput;
    data: XOR<
      TransactionUpdateWithoutTransactionItemsInput,
      TransactionUncheckedUpdateWithoutTransactionItemsInput
    >;
  };

  export type TransactionUpdateWithoutTransactionItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    serialNumber?: NullableIntFieldUpdateOperationsInput | number | null;
    remarks?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    customer?: CustomerUpdateOneRequiredWithoutTransactionsNestedInput;
  };

  export type TransactionUncheckedUpdateWithoutTransactionItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    customerId?: StringFieldUpdateOperationsInput | string;
    serialNumber?: NullableIntFieldUpdateOperationsInput | number | null;
    remarks?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CattleUpsertWithoutTransactionItemsInput = {
    update: XOR<
      CattleUpdateWithoutTransactionItemsInput,
      CattleUncheckedUpdateWithoutTransactionItemsInput
    >;
    create: XOR<
      CattleCreateWithoutTransactionItemsInput,
      CattleUncheckedCreateWithoutTransactionItemsInput
    >;
    where?: CattleWhereInput;
  };

  export type CattleUpdateToOneWithWhereWithoutTransactionItemsInput = {
    where?: CattleWhereInput;
    data: XOR<
      CattleUpdateWithoutTransactionItemsInput,
      CattleUncheckedUpdateWithoutTransactionItemsInput
    >;
  };

  export type CattleUpdateWithoutTransactionItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    cattleNumber?: IntFieldUpdateOperationsInput | number;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender;
    liveWeight?: IntFieldUpdateOperationsInput | number;
    meatPercentage?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    fatPercentage?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    purchasePricePerKg?: IntFieldUpdateOperationsInput | number;
    cattleClass?:
      | EnumCattleClassFieldUpdateOperationsInput
      | $Enums.CattleClass;
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isSold?: BoolFieldUpdateOperationsInput | boolean;
    isQuarantined?: BoolFieldUpdateOperationsInput | boolean;
    isPregnant?: BoolFieldUpdateOperationsInput | boolean;
    isLactating?: BoolFieldUpdateOperationsInput | boolean;
    isInseminated?: BoolFieldUpdateOperationsInput | boolean;
    healthStatus?:
      | EnumHealthStatusFieldUpdateOperationsInput
      | $Enums.HealthStatus;
    healthNotes?: NullableStringFieldUpdateOperationsInput | string | null;
    isVaccinated?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type CattleUncheckedUpdateWithoutTransactionItemsInput = {
    id?: StringFieldUpdateOperationsInput | string;
    cattleNumber?: IntFieldUpdateOperationsInput | number;
    name?: NullableStringFieldUpdateOperationsInput | string | null;
    gender?: EnumGenderFieldUpdateOperationsInput | $Enums.Gender;
    liveWeight?: IntFieldUpdateOperationsInput | number;
    meatPercentage?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    fatPercentage?:
      | DecimalFieldUpdateOperationsInput
      | Decimal
      | DecimalJsLike
      | number
      | string;
    purchasePricePerKg?: IntFieldUpdateOperationsInput | number;
    cattleClass?:
      | EnumCattleClassFieldUpdateOperationsInput
      | $Enums.CattleClass;
    imageUrl?: NullableStringFieldUpdateOperationsInput | string | null;
    isSold?: BoolFieldUpdateOperationsInput | boolean;
    isQuarantined?: BoolFieldUpdateOperationsInput | boolean;
    isPregnant?: BoolFieldUpdateOperationsInput | boolean;
    isLactating?: BoolFieldUpdateOperationsInput | boolean;
    isInseminated?: BoolFieldUpdateOperationsInput | boolean;
    healthStatus?:
      | EnumHealthStatusFieldUpdateOperationsInput
      | $Enums.HealthStatus;
    healthNotes?: NullableStringFieldUpdateOperationsInput | string | null;
    isVaccinated?: BoolFieldUpdateOperationsInput | boolean;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionItemCreateManyCattleInput = {
    id?: string;
    transactionId: string;
    estimatedSalePrice: number;
    actualSalePrice: number;
    totalPrice: number;
    paymentStatus?: $Enums.PaymentStatus;
    paymentDate?: Date | string | null;
    paymentMethod?: $Enums.PaymentMethod | null;
    paidAmount?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionItemUpdateWithoutCattleInput = {
    id?: StringFieldUpdateOperationsInput | string;
    estimatedSalePrice?: IntFieldUpdateOperationsInput | number;
    actualSalePrice?: IntFieldUpdateOperationsInput | number;
    totalPrice?: IntFieldUpdateOperationsInput | number;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentDate?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    paymentMethod?:
      | NullableEnumPaymentMethodFieldUpdateOperationsInput
      | $Enums.PaymentMethod
      | null;
    paidAmount?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    transaction?: TransactionUpdateOneRequiredWithoutTransactionItemsNestedInput;
  };

  export type TransactionItemUncheckedUpdateWithoutCattleInput = {
    id?: StringFieldUpdateOperationsInput | string;
    transactionId?: StringFieldUpdateOperationsInput | string;
    estimatedSalePrice?: IntFieldUpdateOperationsInput | number;
    actualSalePrice?: IntFieldUpdateOperationsInput | number;
    totalPrice?: IntFieldUpdateOperationsInput | number;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentDate?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    paymentMethod?:
      | NullableEnumPaymentMethodFieldUpdateOperationsInput
      | $Enums.PaymentMethod
      | null;
    paidAmount?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionItemUncheckedUpdateManyWithoutCattleInput = {
    id?: StringFieldUpdateOperationsInput | string;
    transactionId?: StringFieldUpdateOperationsInput | string;
    estimatedSalePrice?: IntFieldUpdateOperationsInput | number;
    actualSalePrice?: IntFieldUpdateOperationsInput | number;
    totalPrice?: IntFieldUpdateOperationsInput | number;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentDate?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    paymentMethod?:
      | NullableEnumPaymentMethodFieldUpdateOperationsInput
      | $Enums.PaymentMethod
      | null;
    paidAmount?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionCreateManyCustomerInput = {
    id?: string;
    serialNumber?: number | null;
    remarks?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    serialNumber?: NullableIntFieldUpdateOperationsInput | number | null;
    remarks?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    transactionItems?: TransactionItemUpdateManyWithoutTransactionNestedInput;
  };

  export type TransactionUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    serialNumber?: NullableIntFieldUpdateOperationsInput | number | null;
    remarks?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    transactionItems?: TransactionItemUncheckedUpdateManyWithoutTransactionNestedInput;
  };

  export type TransactionUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string;
    serialNumber?: NullableIntFieldUpdateOperationsInput | number | null;
    remarks?: NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionItemCreateManyTransactionInput = {
    id?: string;
    cattleId: string;
    estimatedSalePrice: number;
    actualSalePrice: number;
    totalPrice: number;
    paymentStatus?: $Enums.PaymentStatus;
    paymentDate?: Date | string | null;
    paymentMethod?: $Enums.PaymentMethod | null;
    paidAmount?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  };

  export type TransactionItemUpdateWithoutTransactionInput = {
    id?: StringFieldUpdateOperationsInput | string;
    estimatedSalePrice?: IntFieldUpdateOperationsInput | number;
    actualSalePrice?: IntFieldUpdateOperationsInput | number;
    totalPrice?: IntFieldUpdateOperationsInput | number;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentDate?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    paymentMethod?:
      | NullableEnumPaymentMethodFieldUpdateOperationsInput
      | $Enums.PaymentMethod
      | null;
    paidAmount?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    cattle?: CattleUpdateOneRequiredWithoutTransactionItemsNestedInput;
  };

  export type TransactionItemUncheckedUpdateWithoutTransactionInput = {
    id?: StringFieldUpdateOperationsInput | string;
    cattleId?: StringFieldUpdateOperationsInput | string;
    estimatedSalePrice?: IntFieldUpdateOperationsInput | number;
    actualSalePrice?: IntFieldUpdateOperationsInput | number;
    totalPrice?: IntFieldUpdateOperationsInput | number;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentDate?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    paymentMethod?:
      | NullableEnumPaymentMethodFieldUpdateOperationsInput
      | $Enums.PaymentMethod
      | null;
    paidAmount?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  export type TransactionItemUncheckedUpdateManyWithoutTransactionInput = {
    id?: StringFieldUpdateOperationsInput | string;
    cattleId?: StringFieldUpdateOperationsInput | string;
    estimatedSalePrice?: IntFieldUpdateOperationsInput | number;
    actualSalePrice?: IntFieldUpdateOperationsInput | number;
    totalPrice?: IntFieldUpdateOperationsInput | number;
    paymentStatus?:
      | EnumPaymentStatusFieldUpdateOperationsInput
      | $Enums.PaymentStatus;
    paymentDate?:
      | NullableDateTimeFieldUpdateOperationsInput
      | Date
      | string
      | null;
    paymentMethod?:
      | NullableEnumPaymentMethodFieldUpdateOperationsInput
      | $Enums.PaymentMethod
      | null;
    paidAmount?: NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string;
  };

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number;
  };

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF;
}
