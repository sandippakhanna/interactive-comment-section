import {
  Avatar,
  Card,
  CardBody,
  HStack,
  VStack,
  Text,
  Heading,
  useBreakpointValue,
  Box,
  Tag,
} from "@chakra-ui/react";
import VoteActions from "./vote-actions";
import CommentActions from "./comment-actions";
import React from "react";
import { getCurrentUser } from "../../helpers";
import { CommentType } from "../../types";

interface Props extends CommentType {
  upOrDownVote: (commentId: number, count: number) => void;
  deleteComment: (commentId: number) => void;
}

const Comment = (props: Props) => {
  const {
    id,
    content,
    createdAt,
    score,
    user,
    replies = [],
    replyingTo,
    upOrDownVote,
    deleteComment,
  } = props;
  const isMobileDevice = useBreakpointValue({ base: true, md: false });
  const replyToLeftMargin = useBreakpointValue({ base: 5, md: 11 });
  const replyToDividerLeftMargin = useBreakpointValue({ base: 0, md: 10 });
  const currentUser = getCurrentUser();
  const cardMarginLeft = (replyingTo ? replyToLeftMargin : 0) as number;

  return (
    <VStack gap={0} w="full">
      <Card
        bg="white"
        p={{ base: 0, md: 2 }}
        borderRadius="lg"
        ml={`${cardMarginLeft}%`}
        w={`${100 - cardMarginLeft}%`}
      >
        <CardBody>
          <HStack columnGap={6} align="start" w="full">
            <VoteActions
              commentId={id}
              upOrDownVote={upOrDownVote}
              hidden={isMobileDevice}
              score={score}
            />

            <VStack w="full">
              <HStack w="full" justifyContent="space-between">
                <HStack columnGap={4}>
                  <Avatar size="sm" src={user.image.png} />
                  <HStack>
                    <Heading
                      as="h3"
                      size="sm"
                      fontWeight="semibold"
                      color="darkBlue.500"
                    >
                      {user.username}
                    </Heading>
                    <Tag
                      size="sm"
                      bg="moderateBlue.500"
                      color="white"
                      borderRadius="sm"
                      hidden={currentUser.username !== user.username}
                    >
                      You
                    </Tag>
                  </HStack>
                  <Text
                    color="grayishBlue.500"
                    fontSize={{ base: "sm", md: "md" }}
                  >
                    {createdAt}
                  </Text>
                </HStack>
                <CommentActions
                  hidden={isMobileDevice}
                  isCurrentUser={currentUser.username == user.username}
                  deleteComment={deleteComment}
                  commentId={id}
                />
              </HStack>

              <Text color="grayishBlue.500" w="full">
                {replyingTo ? (
                  <Text
                    as="span"
                    color="moderateBlue.500"
                    mr={1}
                    fontWeight="semibold"
                  >
                    @{replyingTo}
                  </Text>
                ) : null}
                {content}
              </Text>

              <HStack w="full" justify="space-between" hidden={!isMobileDevice}>
                <VoteActions
                  horizontal={true}
                  score={score}
                  commentId={id}
                  upOrDownVote={upOrDownVote}
                />
                <CommentActions
                  isCurrentUser={currentUser.username == user.username}
                  deleteComment={deleteComment}
                  commentId={id}
                />
              </HStack>
            </VStack>
          </HStack>
        </CardBody>
      </Card>

      {replies.length > 0 ? (
        <>
          <VStack rowGap={6} mt={6} position="relative">
            <Box
              bg="lightGray.500"
              w="2px"
              h="100%"
              position="absolute"
              left={replyToDividerLeftMargin}
              top="0"
              borderRadius="full"
            />
            {replies.map((replyComment) => (
              <Comment
                key={replyComment.id}
                id={replyComment.id}
                content={replyComment.content}
                createdAt={replyComment.createdAt}
                score={replyComment.score}
                user={replyComment.user}
                replyingTo={replyComment.replyingTo}
                upOrDownVote={upOrDownVote}
                deleteComment={deleteComment}
              />
            ))}
          </VStack>
        </>
      ) : null}
    </VStack>
  );
};

export default Comment;
