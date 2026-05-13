import React, { useEffect, useState } from "react";
import {
  getBackendOptions,
  MultiBackend,
  NodeModel,
  Tree,
} from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";
import { coupeMot, truncate } from "@/lib/utils/helper";
import { FaCaretDown, FaCaretRight, FaList } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { CategoryContextType, CategoryTree } from "@/lib/utils/category-tree";
import { extractData } from "@/lib/utils/category-tree";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CategoryNode = NodeModel<{ count: number }>;

interface CategoryMenuProps {
  rawCategories: CategoryTree[];
  getCategoryChildren: (id: string) => Promise<CategoryTree[]>;
  context: () => CategoryContextType;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({
  rawCategories,
  getCategoryChildren,
  context,
}) => {
  const { t } = useTranslation("common");
  const { setSelectedCategoryId, selectedCategoryId } = context();
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const transformedCategories = rawCategories.map(
      (category: CategoryTree) => {
        const { id, title, hasChildren, count } = extractData(category);
        return {
          id,
          text: truncate(coupeMot(title, 15), 25),
          parent: 0,
          droppable: hasChildren,
          data: { count },
        };
      }
    );
    setCategories(transformedCategories);
  }, [rawCategories]);

  const loadChildrenMutation = useMutation({
    mutationFn: (parentId: string) => getCategoryChildren(parentId),
    onSuccess: (children: CategoryTree[], variables: string) => {
      const newChildren = children
        .map((child: CategoryTree) => {
          const { id, title, hasChildren, count } = extractData(child);
          return {
            id,
            text: truncate(coupeMot(title, 15), 25),
            parent: variables,
            droppable: hasChildren,
            data: { count },
          };
        })
        .sort((a: { text: string }, b: { text: string }) =>
          a.text.localeCompare(b.text)
        );

      setCategories((prevCategories) => [
        ...prevCategories,
        ...newChildren.filter(
          (child) =>
            !prevCategories.some(
              (category) => String(category.id) === String(child.id)
            )
        ),
      ]);
      setExpandedNodes((prev) => new Set(prev).add(String(variables)));
    },
  });

  const handleToggle = (node: CategoryNode, isOpen: boolean) => {
    if (isOpen && !expandedNodes.has(node.id as string)) {
      loadChildrenMutation.mutate(node.id as string);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-2 space-y-0 p-4">
        <FaList className="shrink-0" aria-hidden="true" />
        <b className="leading-none">{t("categoryMenu.title")}</b>
      </CardHeader>
      <CardContent className="py-2 pl-2 pr-4">
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <Tree
            tree={categories}
            rootId={0}
            sort
            onDrop={() => {}}
            classes={{
              container: "tree-list",
            }}
            rootProps={{
              "aria-label": t("categoryMenu.treeAria"),
            }}
            render={(node, { depth, isOpen, onToggle }) => (
              <div
                className="flex items-center"
                style={{ marginLeft: depth * 15 }}
              >
                {node.droppable && (
                  <button
                    type="button"
                    onClick={() => {
                      handleToggle(node, !isOpen);
                      onToggle();
                    }}
                    className="cursor-pointer border-0 bg-transparent p-0"
                    aria-label={t("categoryMenu.expandAria", { id: node.id })}
                  >
                    {isOpen ? <FaCaretDown /> : <FaCaretRight />}
                  </button>
                )}
                <div className="flex w-full items-center justify-between pb-1">
                  <div
                    className={`custom-hover${
                      selectedCategoryId === node.id ? " active" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(node.id as string)}
                      className="mx-2 my-1 cursor-pointer border-0 bg-transparent p-0 text-left"
                      aria-label={t("categoryMenu.selectAria", { id: node.id })}
                    >
                      {node.text}
                    </button>
                  </div>
                  <Badge variant="default" className="rounded-full">
                    {node.data?.count}
                  </Badge>
                </div>
              </div>
            )}
          />
        </DndProvider>
      </CardContent>
    </Card>
  );
};

export default CategoryMenu;
