import {
    CognitoIdentityProviderClient,
    AdminCreateUserCommand,
    AdminAddUserToGroupCommand,
    AdminDeleteUserCommand,
    AdminListGroupsForUserCommand,
    AdminRemoveUserFromGroupCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { logger } from "../../config/logger";
import { CreateCognitoUserError } from "../../helper/exceptions/CreateCognitoUserError";
import { MESSAGE } from "../helper/constants/MessageExceptions";
import { AddUserToGroupError } from "../../helper/exceptions/AddUserToGroupError";
import { GetUserGroupsError } from "../../helper/exceptions/GetUserGroupsError";
import { RemoveUserFromGroupsError } from "../../helper/exceptions/RemoveUserFromGroupsError";
import { DeleteUserError } from "../../helper/exceptions/DeleteUserError";
export class CognitoService implements CognitoService {
    private readonly cognitoClient: CognitoIdentityProviderClient;
    private readonly userPoolId: string;

    constructor() {
        this.cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
        this.userPoolId = process.env.COGNITO_USER_POOL_ID!;
    }

    async createCognitoUser(email: string, position: string): Promise<any> {
        try {

            const createUserCommand = new AdminCreateUserCommand({
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

            const response = await this.cognitoClient.send(createUserCommand);
            let result;
            if (response.User) {

                try {
                    
                    logger.info(`User ${response.User?.Username} created successfully`);

                    await this.addUserToGroup(email, position);

                    result = {
                        success: true,
                    };
                } catch (error) {
                    logger.error('Error adding user to group:', error);
                    throw new AddUserToGroupError(MESSAGE.ADD_USER_TO_GROUP);
                }
            } else {
                result = {
                    success: false
                };
            }
            return result;
        } catch (error) {
            logger.error('Error creating user:', error);
            throw new CreateCognitoUserError(MESSAGE.CREATE_COGNITO_USER);
        }
    }

    async addUserToGroup(username: string, groupName: string) {
        try {
            const command = new AdminAddUserToGroupCommand({
                UserPoolId: this.userPoolId,
                Username: username,
                GroupName: groupName
            });

            await this.cognitoClient.send(command);

            return {
                success: true,
                message: `User successfully added to group: ${groupName}`
            };
        } catch (error) {
            console.error('Error adding user to group:', error);
            throw error;
        }
    }

    async deleteCognitoUser(username: string) {
        try {
            // First, get all groups for the user
            const userGroups = await this.getUserGroups(username);

            // Remove user from all groups
            if (userGroups.groups.length > 0) {
                await this.removeUserFromAllGroups(username, userGroups.groups.filter((group): group is string => group !== undefined));
            }

            // Delete the user
            const deleteCommand = new AdminDeleteUserCommand({
                UserPoolId: this.userPoolId,
                Username: username
            });

            await this.cognitoClient.send(deleteCommand);

            return {
                success: true,
                message: `Usuario ${username} eliminado correctamente`,
            };
        } catch (error) {
            if (error instanceof RemoveUserFromGroupsError || error instanceof GetUserGroupsError) {
                throw error;
            } else {
                logger.error('Error :', error);
                throw new DeleteUserError(MESSAGE.DELETE_USER);
            }
        }
    }

    private async getUserGroups(username: string) {
        try {
            const command = new AdminListGroupsForUserCommand({
                UserPoolId: this.userPoolId,
                Username: username
            });

            const response = await this.cognitoClient.send(command);
            return {
                success: true,
                groups: response.Groups?.map(group => group.GroupName) || []
            };
        } catch (error) {
            logger.error('Error obteniendo los grupos del usurio:', error);
            throw new GetUserGroupsError(MESSAGE.GET_USER_GROUPS);
        }
    }

    private async removeUserFromAllGroups(username: string, groups: string[]) {
        try {
            const removePromises = groups.map(groupName =>
                this.cognitoClient.send(
                    new AdminRemoveUserFromGroupCommand({
                        UserPoolId: this.userPoolId,
                        Username: username,
                        GroupName: groupName
                    })
                )
            );

            await Promise.all(removePromises);
        } catch (error) {
            logger.error('Error eliminando el usuario de los grupos a os que pertenecia:', error);
            throw new RemoveUserFromGroupsError(MESSAGE.REMOVE_USER_FROM_GROUP);
        }
    }

}