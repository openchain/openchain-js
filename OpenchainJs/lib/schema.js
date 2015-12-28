"use strict";

var ByteBuffer = require("bytebuffer");
var ProtoBuf = require("protobufjs");

var schema = "\
syntax = 'proto3'; \
\
package Openchain; \
\
message RecordValue { \
    bytes data = 1; \
} \
\
message Record { \
    bytes key = 1; \
    RecordValue value = 2; \
    bytes version = 3; \
} \
\
message Mutation { \
    bytes namespace = 1; \
    repeated Record records = 2; \
    bytes metadata = 3; \
} \
\
message Transaction { \
    bytes mutation = 1; \
    int64 timestamp = 2; \
    bytes transaction_metadata = 3; \
}";

var builder = ProtoBuf.loadProto(schema).build();



module.exports = {
    Record: builder.Openchain.Record,
    Mutation: builder.Openchain.Mutation,
    Transaction: builder.Openchain.Transaction,
    ByteBuffer: ByteBuffer
};
