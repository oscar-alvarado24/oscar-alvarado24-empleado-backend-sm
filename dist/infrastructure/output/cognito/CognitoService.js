"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoService = void 0;
const client_cognito_identity_provider_1 = require("@aws-sdk/client-cognito-identity-provider");
const logger_1 = require("../../../config/logger");
const CreateCognitoUserError_1 = require("../../helper/exceptions/CreateCognitoUserError");
const MessageExceptions_1 = require("../helper/constants/MessageExceptions");
const AddUserToGroupError_1 = require("../../helper/exceptions/AddUserToGroupError");
const GetUserGroupsError_1 = require("../../helper/exceptions/GetUserGroupsError");
const RemoveUserFromGroupsError_1 = require("../../helper/exceptions/RemoveUserFromGroupsError");
const DeleteUserError_1 = require("../../helper/exceptions/DeleteUserError");
class CognitoService {
    constructor() {
        this.cognitoClient = new client_cognito_identity_provider_1.CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
        this.userPoolId = process.env.COGNITO_USER_POOL_ID;
    }
    createCognitoUser(email, position) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const createUserCommand = new client_cognito_identity_provider_1.AdminCreateUserCommand({
                    UserPoolId: this.userPoolId,
                    Username: email,
                    UserAttributes: [
                        {
                            Name: 'email',
                            Value: email,
                        },
                        {
                            Name: 'email_verified',
                            Value: 'true',
                        },
                    ],
                    DesiredDeliveryMediums: ['EMAIL'],
                    MessageAction: 'RESEND',
                });
                const response = yield this.cognitoClient.send(createUserCommand);
                let result;
                if (response.User) {
                    try {
                        logger_1.logger.info(`User ${(_a = response.User) === null || _a === void 0 ? void 0 : _a.Username} created successfully`);
                        yield this.addUserToGroup(email, position);
                        result = {
                            success: true,
                        };
                    }
                    catch (error) {
                        logger_1.logger.error('Error adding user to group:', error);
                        throw new AddUserToGroupError_1.AddUserToGroupError(MessageExceptions_1.MESSAGE.ADD_USER_TO_GROUP);
                    }
                }
                else {
                    result = {
                        success: false
                    };
                }
                return result;
            }
            catch (error) {
                logger_1.logger.error('Error creating user:', error);
                throw new CreateCognitoUserError_1.CreateCognitoUserError(MessageExceptions_1.MESSAGE.CREATE_COGNITO_USER);
            }
        });
    }
    addUserToGroup(username, groupName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const command = new client_cognito_identity_provider_1.AdminAddUserToGroupCommand({
                    UserPoolId: this.userPoolId,
                    Username: username,
                    GroupName: groupName
                });
                yield this.cognitoClient.send(command);
                return {
                    success: true,
                    message: `User successfully added to group: ${groupName}`
                };
            }
            catch (error) {
                console.error('Error adding user to group:', error);
                throw error;
            }
        });
    }
    deleteCognitoUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // First, get all groups for the user
                const userGroups = yield this.getUserGroups(username);
                // Remove user from all groups
                if (userGroups.groups.length > 0) {
                    yield this.removeUserFromAllGroups(username, userGroups.groups.filter((group) => group !== undefined));
                }
                // Delete the user
                const deleteCommand = new client_cognito_identity_provider_1.AdminDeleteUserCommand({
                    UserPoolId: this.userPoolId,
                    Username: username
                });
                yield this.cognitoClient.send(deleteCommand);
                return {
                    success: true,
                    message: `Usuario ${username} eliminado correctamente`,
                };
            }
            catch (error) {
                if (error instanceof RemoveUserFromGroupsError_1.RemoveUserFromGroupsError || error instanceof GetUserGroupsError_1.GetUserGroupsError) {
                    throw error;
                }
                else {
                    logger_1.logger.error('Error :', error);
                    throw new DeleteUserError_1.DeleteUserError(MessageExceptions_1.MESSAGE.DELETE_USER);
                }
            }
        });
    }
    getUserGroups(username) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const command = new client_cognito_identity_provider_1.AdminListGroupsForUserCommand({
                    UserPoolId: this.userPoolId,
                    Username: username
                });
                const response = yield this.cognitoClient.send(command);
                return {
                    success: true,
                    groups: ((_a = response.Groups) === null || _a === void 0 ? void 0 : _a.map(group => group.GroupName)) || []
                };
            }
            catch (error) {
                logger_1.logger.error('Error obteniendo los grupos del usurio:', error);
                throw new GetUserGroupsError_1.GetUserGroupsError(MessageExceptions_1.MESSAGE.GET_USER_GROUPS);
            }
        });
    }
    removeUserFromAllGroups(username, groups) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const removePromises = groups.map(groupName => this.cognitoClient.send(new client_cognito_identity_provider_1.AdminRemoveUserFromGroupCommand({
                    UserPoolId: this.userPoolId,
                    Username: username,
                    GroupName: groupName
                })));
                yield Promise.all(removePromises);
            }
            catch (error) {
                logger_1.logger.error('Error eliminando el usuario de los grupos a os que pertenecia:', error);
                throw new RemoveUserFromGroupsError_1.RemoveUserFromGroupsError(MessageExceptions_1.MESSAGE.REMOVE_USER_FROM_GROUP);
            }
        });
    }
}
exports.CognitoService = CognitoService;
//# sourceMappingURL=CognitoService.js.map